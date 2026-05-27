const fs = require('fs');
const path = require('path');
const https = require('https');

// 1. Setup GitHub credentials from .env
let token = '';
let username = '';

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/).map(line => line.trim());
    let inGithubSection = false;

    for (const line of lines) {
      if (line.toLowerCase() === 'github') {
        inGithubSection = true;
      } else if (line.toLowerCase() === 'apt' || line.toLowerCase() === 'kakao') {
        inGithubSection = false;
      } else if (inGithubSection) {
        if (line.startsWith('key=')) {
          token = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('usename=')) {
          username = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (err) {
    console.error('Error parsing .env file:', err);
    process.exit(1);
  }
}

if (!token || !username) {
  console.error('[Error] GitHub credentials not found in .env file!');
  process.exit(1);
}

const repoName = 'apt-dashboard';

// Generic HTTPS request sender helper
function sendGithubRequest(method, urlPath, bodyData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: urlPath,
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'VibeCode-Git-All-Initializer',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          if (data) parsed = JSON.parse(data);
        } catch (e) {
          // Non-JSON response
        }
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

// Recursively traverse directory to collect all deployable files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');

    // EXCLUDE filters (Ignore critical environment configs, giant dependencies, and temporary logs)
    if (
      file === '.git' || 
      file === 'node_modules' || 
      file === '.env' || 
      file === 'scratch' || 
      file === '.gemini' ||
      relPath.startsWith('.system_generated')
    ) {
      continue;
    }

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push({
        localPath: relPath,
        repoPath: relPath
      });
    }
  }
  return fileList;
}

async function start() {
  console.log(`====================================================`);
  console.log(`  GitHub Full Deploy Automation Script              `);
  console.log(`  User: ${username} | Repo Target: ${repoName}      `);
  console.log(`====================================================`);

  // 1. Create remote GitHub repository if not exists
  console.log(`[1/3] Checking GitHub Repository '${repoName}'...`);
  try {
    const createRes = await sendGithubRequest('POST', '/user/repos', {
      name: repoName,
      description: '아파트 실거래가 조회 및 카카오 지도 연동 프리미엄 대시보드',
      private: false,
      auto_init: false
    });

    if (createRes.statusCode === 201) {
      console.log(`✨ Repository successfully created on GitHub!`);
    } else if (createRes.statusCode === 422) {
      console.log(`ℹ️ Repository already exists. Proceeding to push/update all files.`);
    } else {
      console.error(`❌ Failed to create repository (Status: ${createRes.statusCode}):`, createRes.body);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Network error while checking repository:', error);
    process.exit(1);
  }

  // 2. Scan and list all files to deploy (except gitignored ones)
  console.log(`\n[2/3] Scanning entire directory recursively...`);
  const filesToUpload = getAllFiles(__dirname);
  console.log(`   🔍 Found ${filesToUpload.length} file(s) to upload.`);

  // 3. Upload each file sequentially
  console.log(`\n[3/3] Uploading all files to GitHub via REST API...`);
  
  for (const file of filesToUpload) {
    const fullLocalPath = path.join(__dirname, file.localPath);
    if (!fs.existsSync(fullLocalPath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(fullLocalPath);
      const base64Content = content.toString('base64');
      
      // A. Check if file already exists in the repo to retrieve its 'sha' for updates
      const checkPath = `/repos/${username}/${repoName}/contents/${file.repoPath}`;
      const checkRes = await sendGithubRequest('GET', checkPath);
      
      let sha = null;
      if (checkRes.statusCode === 200 && checkRes.body && checkRes.body.sha) {
        sha = checkRes.body.sha;
      }

      // B. Upload file
      const uploadBody = {
        message: `feat: sync ${file.repoPath} recursively`,
        content: base64Content
      };
      if (sha) {
        uploadBody.sha = sha; // required to update existing files
      }

      console.log(`Uploading ${file.localPath}...`);
      const uploadRes = await sendGithubRequest('PUT', checkPath, uploadBody);

      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 201) {
        console.log(`   ✅ Success: ${file.localPath} synced!`);
      } else {
        console.error(`   ❌ Failed: ${file.localPath} (Status: ${uploadRes.statusCode})`, uploadRes.body);
      }
    } catch (err) {
      console.error(`   ❌ Error processing ${file.localPath}:`, err);
    }
  }

  console.log(`\n====================================================`);
  console.log(`🎉 SUCCESS! GitHub Full Synchronization Complete!`);
  console.log(`👉 Visit your repository: https://github.com/${username}/${repoName}`);
  console.log(`====================================================`);
}

start();
