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
  console.error('[Error] GitHub key or usename not found in .env file!');
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
        'User-Agent': 'VibeCode-Git-Initializer',
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

async function start() {
  console.log(`====================================================`);
  console.log(`  GitHub Integration Automation Script              `);
  console.log(`  User: ${username} | Repo Target: ${repoName}      `);
  console.log(`====================================================`);

  // 1. Create remote GitHub repository if not exists
  console.log(`[1/3] Creating GitHub Repository '${repoName}'...`);
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
      console.log(`ℹ️ Repository already exists on your GitHub account. Proceeding to push files.`);
    } else {
      console.error(`❌ Failed to create repository (Status: ${createRes.statusCode}):`, createRes.body);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Network error while creating repository:', error);
    process.exit(1);
  }

  // 2. Prepare file list to upload
  console.log(`\n[2/3] Scanning local files to deploy...`);
  const filesToUpload = [
    { localPath: 'package.json', repoPath: 'package.json' },
    { localPath: 'server.js', repoPath: 'server.js' },
    { localPath: 'public/index.html', repoPath: 'public/index.html' },
    { localPath: 'public/index.css', repoPath: 'public/index.css' },
    { localPath: 'public/index.js', repoPath: 'public/index.js' }
  ];

  // Auto-generate a clean .gitignore if not present
  const gitignorePath = path.join(__dirname, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, "node_modules/\n.env\n.DS_Store\nscratch/\n", 'utf8');
  }
  filesToUpload.push({ localPath: '.gitignore', repoPath: '.gitignore' });

  // 3. Upload each file sequentially
  console.log(`\n[3/3] Uploading files to GitHub via REST API...`);
  
  for (const file of filesToUpload) {
    const fullLocalPath = path.join(__dirname, file.localPath);
    if (!fs.existsSync(fullLocalPath)) {
      console.log(`⚠️ Skip missing file: ${file.localPath}`);
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
        message: `feat: deploy ${file.repoPath} dynamically via agent`,
        content: base64Content
      };
      if (sha) {
        uploadBody.sha = sha; // required to update existing files
      }

      console.log(`Uploading ${file.localPath}...`);
      const uploadRes = await sendGithubRequest('PUT', checkPath, uploadBody);

      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 201) {
        console.log(`   ✅ Success: ${file.localPath} uploaded!`);
      } else {
        console.error(`   ❌ Failed: ${file.localPath} (Status: ${uploadRes.statusCode})`, uploadRes.body);
      }
    } catch (err) {
      console.error(`   ❌ Error processing ${file.localPath}:`, err);
    }
  }

  console.log(`\n====================================================`);
  console.log(`🎉 SUCCESS! GitHub Integration Complete!`);
  console.log(`👉 Visit your repository: https://github.com/${username}/${repoName}`);
  console.log(`====================================================`);
}

start();
