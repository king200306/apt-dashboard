// ==========================================================================
// APT Finder - Client-Side Interactive Logic
// Handles Region Selection, API Fetches, Dynamic Charts, and Interactive Tables
// ==========================================================================

// Complete Hierarchical District Map for Korean Real Estate Markets (전국 전체)
const REGION_DATA = {
  "서울특별시": {
    "강남구": "11680", "강동구": "11740", "강북구": "11305", "강서구": "11500", "관악구": "11620",
    "광진구": "11215", "구로구": "11530", "금천구": "11545", "노원구": "11350", "도봉구": "11320",
    "동대문구": "11230", "동작구": "11590", "마포구": "11440", "서대문구": "11410", "서초구": "11650",
    "성동구": "11200", "성북구": "11290", "송파구": "11710", "양천구": "11470", "영등포구": "11560",
    "용산구": "11170", "은평구": "11380", "종로구": "11110", "중구": "11140", "중랑구": "11260"
  },
  "부산광역시": {
    "중구": "26110", "서구": "26140", "동구": "26170", "영도구": "26200", "부산진구": "26230",
    "동래구": "26260", "남구": "26290", "북구": "26320", "해운대구": "26350", "사하구": "26380",
    "금정구": "26410", "강서구": "26440", "연제구": "26470", "수영구": "26500", "사상구": "26530",
    "기장군": "26710"
  },
  "대구광역시": {
    "중구": "27110", "동구": "27140", "서구": "27170", "남구": "27200", "북구": "27230",
    "수성구": "27260", "달서구": "27290", "달성군": "27710", "군위군": "27720"
  },
  "인천광역시": {
    "중구": "28110", "동구": "28140", "미추홀구": "28177", "연수구": "28185", "남동구": "28200",
    "부평구": "28237", "계양구": "28245", "서구": "28260", "강화군": "28710", "옹진군": "28720"
  },
  "광주광역시": {
    "동구": "29110", "서구": "29140", "남구": "29170", "북구": "29200", "광산구": "29230"
  },
  "대전광역시": {
    "동구": "30110", "중구": "30140", "서구": "30170", "유성구": "30200", "대덕구": "30230"
  },
  "울산광역시": {
    "중구": "31110", "남구": "31140", "동구": "31170", "북구": "31200", "울주군": "31710"
  },
  "세종특별자치시": {
    "세종시": "36110"
  },
  "경기도": {
    "수원시 장안구": "41111", "수원시 권선구": "41113", "수원시 팔달구": "41115", "수원시 영통구": "41117",
    "성남시 수정구": "41131", "성남시 중원구": "41133", "성남시 분당구": "41135",
    "의정부시": "41150", "안양시 만안구": "41171", "안양시 동안구": "41173",
    "부천시": "41190", "광명시": "41210", "평택시": "41220", "동두천시": "41250",
    "안산시 상록구": "41271", "안산시 단원구": "41273",
    "고양시 덕양구": "41281", "고양시 일산동구": "41285", "고양시 일산서구": "41287",
    "과천시": "41290", "구리시": "41310", "남양주시": "41360", "오산시": "41370", "시흥시": "41390",
    "군포시": "41410", "의왕시": "41430", "하남시": "41450",
    "용인시 처인구": "41461", "용인시 기흥구": "41463", "용인시 수지구": "41465",
    "파주시": "41480", "이천시": "41500", "안성시": "41550", "김포시": "41570", "화성시": "41590",
    "광주시": "41610", "양주시": "41630", "포천시": "41650", "여주시": "41670",
    "연천군": "41800", "가평군": "41820", "양평군": "41830"
  },
  "강원특별자치도": {
    "춘천시": "51110", "원주시": "51130", "강릉시": "51150", "동해시": "51170", "태백시": "51190",
    "속초시": "51210", "삼척시": "51230", "홍천군": "51720", "횡성군": "51730", "영월군": "51750",
    "평창군": "51760", "정선군": "51770", "철원군": "51780", "화천군": "51790", "양구군": "51800",
    "인제군": "51810", "고성군": "51820", "양양군": "51830"
  },
  "충청북도": {
    "청주시 상당구": "43111", "청주시 서원구": "43112", "청주시 흥덕구": "43113", "청주시 청원구": "43114",
    "충주시": "43130", "제천시": "43150", "보은군": "43720", "옥천군": "43730", "영동군": "43740",
    "증평군": "43745", "진천군": "43750", "괴산군": "43760", "음성군": "43770",
    "단양군": "43800"
  },
  "충청남도": {
    "천안시 동남구": "44131", "천안시 서북구": "44133", "공주시": "44150", "보령시": "44180",
    "아산시": "44200", "서산시": "44210", "논산시": "44230", "계룡시": "44250", "당진시": "44270",
    "금산군": "44710", "부여군": "44760", "서천군": "44770", "청양군": "44790",
    "홍성군": "44800", "예산군": "44810", "태안군": "44825"
  },
  "전북특별자치도": {
    "전주시 완산구": "52111", "전주시 덕진구": "52113", "군산시": "52130", "익산시": "52140",
    "정읍시": "52180", "남원시": "52190", "김제시": "52210",
    "완주군": "52710", "진안군": "52720", "무주군": "52730", "장수군": "52740",
    "임실군": "52750", "순창군": "52770", "고창군": "52790", "부안군": "52800"
  },
  "전라남도": {
    "목포시": "46110", "여수시": "46130", "순천시": "46150", "나주시": "46170", "광양시": "46230",
    "담양군": "46710", "곡성군": "46720", "구례군": "46730", "고흥군": "46770", "보성군": "46780",
    "화순군": "46790", "장흥군": "46800", "강진군": "46810", "해남군": "46820", "영암군": "46830",
    "무안군": "46840", "함평군": "46860", "영광군": "46870", "장성군": "46880",
    "완도군": "46890", "진도군": "46900", "신안군": "46910"
  },
  "경상북도": {
    "포항시 남구": "47111", "포항시 북구": "47113", "경주시": "47130", "김천시": "47150",
    "안동시": "47170", "구미시": "47190", "영주시": "47210", "영천시": "47230",
    "상주시": "47250", "문경시": "47280", "경산시": "47290",
    "의성군": "47730", "청송군": "47750", "영양군": "47760", "영덕군": "47770",
    "청도군": "47820", "고령군": "47830", "성주군": "47840", "칠곡군": "47850",
    "예천군": "47900", "봉화군": "47920", "울진군": "47930", "울릉군": "47940"
  },
  "경상남도": {
    "창원시 의창구": "48121", "창원시 성산구": "48123", "창원시 마산합포구": "48125",
    "창원시 마산회원구": "48127", "창원시 진해구": "48129",
    "진주시": "48170", "통영시": "48220", "사천시": "48240", "김해시": "48250",
    "밀양시": "48270", "거제시": "48310", "양산시": "48330",
    "의령군": "48720", "함안군": "48730", "창녕군": "48740", "고성군": "48820",
    "남해군": "48840", "하동군": "48850", "산청군": "48860", "함양군": "48870",
    "거창군": "48880", "합천군": "48890"
  },
  "제주특별자치도": {
    "제주시": "50110", "서귀포시": "50130"
  }
};

// Application State
let state = {
  rawTransactions: [],        // Raw transaction array from API
  processedTransactions: [],  // Clean, parsed data objects
  filteredTransactions: [],   // After applying search and size filter
  currentSort: {
    column: 'dealDate',
    direction: 'desc'
  },
  charts: {
    sizeChart: null,
    topAptsChart: null
  },
  map: null,                  // Kakao Map object
  markers: [],                // Array to hold multiple Kakao Map markers
  mapInfoWindow: null,        // Currently displayed custom InfoWindow
  geocoder: null,             // Kakao address Geocoder
  kakaoLoaded: false,         // Whether Kakao API loaded successfully
  pagination: {
    currentPage: 1,
    itemsPerPage: 15
  }
};

// Elements Selectors
const sidoSelect = document.getElementById('sidoSelect');
const sigunguSelect = document.getElementById('sigunguSelect');
const monthSelect = document.getElementById('monthSelect');
const searchButton = document.getElementById('searchButton');
const searchSpinner = document.getElementById('searchSpinner');

const welcomeScreen = document.getElementById('welcomeScreen');
const dashboardContent = document.getElementById('dashboardContent');

// Metrics elements
const valAvgPrice = document.getElementById('valAvgPrice');
const valAvgPriceSub = document.getElementById('valAvgPriceSub');
const valMaxPrice = document.getElementById('valMaxPrice');
const valMaxPriceSub = document.getElementById('valMaxPriceSub');
const valTotalCount = document.getElementById('valTotalCount');
const valTotalCountSub = document.getElementById('valTotalCountSub');
const valAvgUnitPrice = document.getElementById('valAvgUnitPrice');
const valAvgUnitPriceSub = document.getElementById('valAvgUnitPriceSub');

// Table and Controls elements
const tableSearchInput = document.getElementById('tableSearchInput');
const sizeFilterSelect = document.getElementById('sizeFilterSelect');
const tableBody = document.getElementById('transactionsTableBody');
const tableCountText = document.getElementById('tableCountText');
const csvExportBtn = document.getElementById('csvExportBtn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initRegionDropdowns();
  initDefaultMonth();
  initEventListeners();
  loadKakaoMapAPI(); // Asynchronously load Kakao Maps SDK
});

// Setup City/District Cascade Selectors
function initRegionDropdowns() {
  // Populate Sido dropdown
  for (const sido in REGION_DATA) {
    const opt = document.createElement('option');
    opt.value = sido;
    opt.textContent = sido;
    sidoSelect.appendChild(opt);
  }

  // Handle Sido selection change
  sidoSelect.addEventListener('change', () => {
    const selectedSido = sidoSelect.value;
    sigunguSelect.innerHTML = '<option value="">시/군/구 선택</option>';
    
    if (selectedSido && REGION_DATA[selectedSido]) {
      sigunguSelect.disabled = false;
      const sigungus = REGION_DATA[selectedSido];
      for (const sigungu in sigungus) {
        const opt = document.createElement('option');
        opt.value = sigungus[sigungu];
        opt.textContent = sigungu;
        sigunguSelect.appendChild(opt);
      }
    } else {
      sigunguSelect.disabled = true;
    }
  });
}

// Set recent valid month as default (e.g. 2 months ago, or 2023-12 for reliable test data)
function initDefaultMonth() {
  const d = new Date();
  // Adjust back 2 months to ensure public data is complete
  d.setMonth(d.getMonth() - 2);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  monthSelect.value = `${yyyy}-${mm}`;
}

// Set up UI Event Listeners
function initEventListeners() {
  // Search Button
  searchButton.addEventListener('click', handleSearch);

  // Recommendations Quick Tags
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tag = e.currentTarget;
      const sido = tag.dataset.sido;
      const sigunguCode = tag.dataset.sigungu;
      const month = tag.dataset.month;

      sidoSelect.value = sido;
      sidoSelect.dispatchEvent(new Event('change'));
      sigunguSelect.value = sigunguCode;
      monthSelect.value = month;

      handleSearch();
    });
  });

  // Table Search Input (Debounced / Real-time)
  tableSearchInput.addEventListener('input', () => {
    state.pagination.currentPage = 1;
    filterAndRenderTable();
  });

  // Table Size Filter
  sizeFilterSelect.addEventListener('change', () => {
    state.pagination.currentPage = 1;
    filterAndRenderTable();
  });

  // CSV Export
  csvExportBtn.addEventListener('click', exportToCSV);

  // Table Headers Sort trigger
  document.querySelectorAll('#transactionsTable th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortBy = th.dataset.sort;
      
      // Toggle direction if already sorting by same column
      if (state.currentSort.column === sortBy) {
        state.currentSort.direction = state.currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.currentSort.column = sortBy;
        state.currentSort.direction = 'desc'; // default to descending
      }

      // Update Sort Header Icons in UI
      document.querySelectorAll('#transactionsTable th.sortable').forEach(head => {
        head.classList.remove('sorted-asc', 'sorted-desc');
        const arrow = head.querySelector('.sort-arrow');
        if (arrow) arrow.textContent = '';
      });

      th.classList.add(state.currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) {
        arrow.textContent = state.currentSort.direction === 'asc' ? ' ↑' : ' ↓';
      }

      filterAndRenderTable();
    });
  });
}

// Core Search Handler
async function handleSearch() {
  const sido = sidoSelect.value;
  const sigungu = sigunguSelect.value;
  const monthRaw = monthSelect.value; // YYYY-MM

  // Reset pagination to page 1 for a new query
  state.pagination.currentPage = 1;

  if (!sido || !sigungu) {
    alert('시/도 및 시/군/구를 선택해 주세요.');
    return;
  }
  if (!monthRaw) {
    alert('조회할 연월을 선택해 주세요.');
    return;
  }

  // Format month to YYYYMM for Government API
  const dealYmd = monthRaw.replace('-', '');

  // Update Loading UI State
  searchButton.classList.add('btn-loading');
  searchButton.disabled = true;

  try {
    const url = `/api/transactions?lawdCd=${sigungu}&dealYmd=${dealYmd}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errJson = await response.json();
      throw new Error(errJson.error || '실거래 자료를 가져오지 못했습니다.');
    }

    const data = await response.json();
    state.rawTransactions = data;

    // Process and sanitize data
    processData();

    if (state.processedTransactions.length === 0) {
      alert('해당 기간에 조회된 거래 정보가 존재하지 않습니다.');
      welcomeScreen.style.display = 'block';
      dashboardContent.style.display = 'none';
    } else {
      // Toggle dashboard display
      welcomeScreen.style.display = 'none';
      dashboardContent.style.display = 'block';

      // Load Statistics and Graphics
      loadMetrics();
      filterAndRenderTable();
      renderCharts();

      // Centering map to searched region and render multiple markers
      const sigunguText = sigunguSelect.options[sigunguSelect.selectedIndex].text;
      moveMapToRegion(sido, sigunguText);
      
      setTimeout(() => {
        displayAllTransactionsOnMap();
      }, 200);
    }

  } catch (error) {
    console.error('Search error:', error);
    alert('오류가 발생했습니다: ' + error.message);
  } finally {
    searchButton.classList.remove('btn-loading');
    searchButton.disabled = false;
  }
}

// Data parser and compiler
function processData() {
  state.processedTransactions = state.rawTransactions.map((item, idx) => {
    // 1. Sanitize Deal Amount (string with commas and whitespaces to clean integer in 10,000 KRW units)
    let amountRaw = String(item.dealAmount || '0').replace(/,/g, '').trim();
    let amount = parseInt(amountRaw, 10) || 0;

    // 2. Parse Exclusive Area Size (m²)
    let area = parseFloat(item.excluUseAr) || 0;

    // 3. Compute Unit Price per Pyeong (전용면적 3.3m²당 금액)
    let unitPricePyeong = 0;
    if (area > 0) {
      unitPricePyeong = Math.round((amount / area) * 3.3);
    }

    // 4. Clean Contract Date (combine Year, Month, Day)
    const year = item.dealYear;
    const month = String(item.dealMonth).padStart(2, '0');
    const day = String(item.dealDay).padStart(2, '0');
    const dealDateStr = `${year}-${month}-${day}`;

    // 5. Floor information
    const floor = parseInt(item.floor, 10) || 0;

    // 6. Build Year
    const buildYear = parseInt(item.buildYear, 10) || 0;

    return {
      id: idx,
      aptNm: String(item.aptNm).trim(),
      umdNm: String(item.umdNm).trim(),
      excluUseAr: area,
      dealAmount: amount, // in ten-thousand KRW
      dealDate: dealDateStr,
      floor: floor,
      buildYear: buildYear,
      unitPrice: unitPricePyeong, // in ten-thousand KRW per 3.3m²
      jibun: item.jibun || ''
    };
  });
}

// Format currency in dynamic Korean scale (e.g. 102500 -> '10억 2,500만원')
function formatKoreanPrice(tenThousandUnit) {
  if (tenThousandUnit === 0) return '0원';
  
  const Eok = Math.floor(tenThousandUnit / 10000);
  const Remainder = tenThousandUnit % 10000;
  
  let formatted = '';
  if (Eok > 0) {
    formatted += `${Eok}억 `;
  }
  if (Remainder > 0) {
    formatted += `${Remainder.toLocaleString()}만원`;
  } else if (Eok > 0) {
    formatted += '원';
  } else {
    formatted += '0원';
  }
  return formatted.trim();
}

// Calculate and load dashboard summary metrics
function loadMetrics() {
  const list = state.processedTransactions;
  const count = list.length;
  
  // 1. Transaction Count
  valTotalCount.textContent = `${count.toLocaleString()}건`;
  valTotalCountSub.textContent = `${monthSelect.value.replace('-', '년 ')}월 계약 성사`;

  // 2. Average price
  const sumPrice = list.reduce((sum, item) => sum + item.dealAmount, 0);
  const avgPrice = Math.round(sumPrice / count);
  valAvgPrice.textContent = formatKoreanPrice(avgPrice);

  // 3. Average size
  const sumSize = list.reduce((sum, item) => sum + item.excluUseAr, 0);
  const avgSize = (sumSize / count).toFixed(1);
  valAvgPriceSub.textContent = `평균 전용면적 ${avgSize}㎡ 기준`;

  // 4. Highest Transaction price
  const sortedByPrice = [...list].sort((a, b) => b.dealAmount - a.dealAmount);
  const maxDeal = sortedByPrice[0];
  valMaxPrice.textContent = formatKoreanPrice(maxDeal.dealAmount);
  valMaxPriceSub.textContent = `${maxDeal.aptNm} (${Math.round(maxDeal.excluUseAr)}㎡, ${maxDeal.floor}층)`;

  // 5. Avg Unit Price per Pyeong
  const sumUnitPrice = list.reduce((sum, item) => sum + item.unitPrice, 0);
  const avgUnitPrice = Math.round(sumUnitPrice / count);
  valAvgUnitPrice.textContent = `${avgUnitPrice.toLocaleString()}만원`;
  valAvgUnitPriceSub.textContent = '3.3㎡ (1평)당 평균 매매 단가';
}

// Filter, Sort, and Populate data table with pagination (15 items per page)
function filterAndRenderTable() {
  const searchTerm = tableSearchInput.value.toLowerCase().trim();
  const sizeFilter = sizeFilterSelect.value;
  
  // Apply filters
  state.filteredTransactions = state.processedTransactions.filter(item => {
    // Search match (Apartment Name or Dong)
    const matchesSearch = item.aptNm.toLowerCase().includes(searchTerm) || 
                          item.umdNm.toLowerCase().includes(searchTerm);
    
    // Size match
    let matchesSize = true;
    if (sizeFilter === 'small') {
      matchesSize = item.excluUseAr <= 59;
    } else if (sizeFilter === 'medium') {
      matchesSize = item.excluUseAr > 59 && item.excluUseAr <= 85;
    } else if (sizeFilter === 'large') {
      matchesSize = item.excluUseAr > 85;
    }

    return matchesSearch && matchesSize;
  });

  // Apply Sorting
  const sortCol = state.currentSort.column;
  const sortDir = state.currentSort.direction;
  
  state.filteredTransactions.sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    
    if (typeof valA === 'string') {
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortDir === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Pagination Math
  const totalItems = state.filteredTransactions.length;
  const itemsPerPage = state.pagination.itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Safeguard page bounds
  if (state.pagination.currentPage > totalPages) {
    state.pagination.currentPage = totalPages;
  }
  if (state.pagination.currentPage < 1) {
    state.pagination.currentPage = 1;
  }

  const startIndex = (state.pagination.currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageItems = state.filteredTransactions.slice(startIndex, endIndex);

  // Render Rows for Current Page
  tableBody.innerHTML = '';
  pageItems.forEach(item => {
    const row = document.createElement('tr');
    const contractDate = item.dealDate.substring(5).replace('-', '/'); // "12/26"

    row.innerHTML = `
      <td>${contractDate}</td>
      <td>${item.umdNm}</td>
      <td title="${item.aptNm} (지번: ${item.jibun})">${item.aptNm}</td>
      <td><span class="text-area">${item.excluUseAr.toFixed(1)}㎡</span></td>
      <td><span class="text-price">${formatKoreanPrice(item.dealAmount)}</span></td>
      <td><span class="badge-floor">${item.floor}층</span></td>
      <td>${item.buildYear}</td>
    `;

    row.addEventListener('click', () => {
      focusApartmentOnMap(item);
      if (window.innerWidth <= 1024) {
        document.getElementById('mapPanel').scrollIntoView({ behavior: 'smooth' });
      }
    });

    tableBody.appendChild(row);
  });

  // Update Footer Count & Pagination buttons
  if (totalItems === 0) {
    tableCountText.textContent = `총 0개 중 0개 표시됨`;
  } else {
    tableCountText.textContent = `총 ${totalItems.toLocaleString()}건 중 ${startIndex + 1}~${endIndex}번째 표시됨 (페이지 ${state.pagination.currentPage}/${totalPages})`;
  }
  
  renderPaginationControls(totalPages);
}

// Generate dynamic pagination buttons (Prev, Page numbers, Next)
function renderPaginationControls(totalPages) {
  const container = document.getElementById('paginationControls');
  if (!container) return;

  container.innerHTML = '';

  const currentPage = state.pagination.currentPage;

  // 1. Previous Page Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '&lt;'; // '<' character
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    state.pagination.currentPage--;
    filterAndRenderTable();
    // Scroll table to top smoothly
    document.querySelector('.table-container').scrollTop = 0;
  });
  container.appendChild(prevBtn);

  // 2. Dynamic Page Numbers (Show adjacent pages to current page for clean UI)
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      state.pagination.currentPage = i;
      filterAndRenderTable();
      document.querySelector('.table-container').scrollTop = 0;
    });
    container.appendChild(pageBtn);
  }

  // 3. Next Page Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '&gt;'; // '>' character
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    state.pagination.currentPage++;
    filterAndRenderTable();
    document.querySelector('.table-container').scrollTop = 0;
  });
  container.appendChild(nextBtn);
}

// Generate premium analytics charts using Chart.js
function renderCharts() {
  // 1. Destroy existing charts if they exist to prevent canvas reuse errors
  if (state.charts.sizeChart) state.charts.sizeChart.destroy();
  if (state.charts.topAptsChart) state.charts.topAptsChart.destroy();

  const list = state.processedTransactions;

  // Chart A: Size Distribution (Doughnut)
  let sizes = { small: 0, medium: 0, large: 0 };
  list.forEach(item => {
    if (item.excluUseAr <= 59) sizes.small++;
    else if (item.excluUseAr <= 85) sizes.medium++;
    else sizes.large++;
  });

  const ctxSize = document.getElementById('priceDistributionChart').getContext('2d');
  state.charts.sizeChart = new Chart(ctxSize, {
    type: 'doughnut',
    data: {
      labels: ['소형 (~59㎡)', '중형 (59~85㎡)', '대형 (85㎡~)'],
      datasets: [{
        data: [sizes.small, sizes.medium, sizes.large],
        backgroundColor: [
          'rgba(56, 189, 248, 0.75)',  // Cyan/Blue
          'rgba(168, 85, 247, 0.75)',  // Purple
          'rgba(251, 146, 60, 0.75)'   // Orange
        ],
        borderColor: [
          '#1e293b', '#1e293b', '#1e293b'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#94a3b8',
            font: {
              family: 'Inter, sans-serif',
              size: 11,
              weight: '500'
            }
          }
        },
        title: {
          display: true,
          text: '거래 주택 평형 비율',
          color: '#f8fafc',
          font: {
            family: 'Outfit, sans-serif',
            size: 13,
            weight: '600'
          },
          padding: { bottom: 12 }
        }
      }
    }
  });

  // Chart B: Top 5 Highest Average Price Apartments
  // Group by apartment name, find average deal price
  const aptPriceGroup = {};
  list.forEach(item => {
    if (!aptPriceGroup[item.aptNm]) {
      aptPriceGroup[item.aptNm] = { sum: 0, count: 0 };
    }
    aptPriceGroup[item.aptNm].sum += item.dealAmount;
    aptPriceGroup[item.aptNm].count++;
  });

  const aptAverages = [];
  for (const apt in aptPriceGroup) {
    aptAverages.push({
      name: apt,
      avgPrice: Math.round(aptPriceGroup[apt].sum / aptPriceGroup[apt].count)
    });
  }

  // Sort descending, get top 5
  aptAverages.sort((a, b) => b.avgPrice - a.avgPrice);
  const topApts = aptAverages.slice(0, 5);

  const ctxTop = document.getElementById('topPriceApartmentsChart').getContext('2d');
  state.charts.topAptsChart = new Chart(ctxTop, {
    type: 'bar',
    data: {
      labels: topApts.map(a => a.name.length > 8 ? a.name.substring(0, 7) + '..' : a.name),
      datasets: [{
        label: '평균 실거래가 (억원)',
        data: topApts.map(a => (a.avgPrice / 10000).toFixed(2)),
        backgroundColor: 'rgba(56, 189, 248, 0.4)',
        borderColor: 'rgba(56, 189, 248, 0.95)',
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y', // horizontal bar chart
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#f8fafc', font: { size: 10, weight: '600' } }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: '최고가 아파트단지 Top 5 (평균, 억원)',
          color: '#f8fafc',
          font: {
            family: 'Outfit, sans-serif',
            size: 13,
            weight: '600'
          },
          padding: { bottom: 12 }
        }
      }
    }
  });
}

// Export Table Data to CSV
function exportToCSV() {
  const data = state.filteredTransactions;
  if (data.length === 0) {
    alert('내보낼 데이터가 존재하지 않습니다.');
    return;
  }

  // Define headers
  const csvHeaders = ['거래일', '법정동', '아파트명', '전용면적(㎡)', '거래금액(만원)', '층수', '건축년도', '평당가(만원)'];
  
  // Build CSV content with BOM for Korean encoding in Excel
  let csvContent = '\uFEFF'; // Excel UTF-8 BOM
  csvContent += csvHeaders.join(',') + '\n';

  data.forEach(item => {
    const row = [
      item.dealDate,
      item.umdNm,
      `"${item.aptNm.replace(/"/g, '""')}"`, // escape quotes for security
      item.excluUseAr.toFixed(2),
      item.dealAmount,
      item.floor,
      item.buildYear,
      item.unitPrice
    ];
    csvContent += row.join(',') + '\n';
  });

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Filename formatting
  const sido = sidoSelect.value;
  const sigunguText = sigunguSelect.options[sigunguSelect.selectedIndex].text;
  const month = monthSelect.value;
  
  link.setAttribute('href', url);
  link.setAttribute('download', `APT_실거래가_${sido}_${sigunguText}_${month}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// Kakao Map Helper Operations
// ==========================================================================

// Fetch Kakao key and insert script tag dynamically
async function loadKakaoMapAPI() {
  try {
    const response = await fetch('/api/map-key');
    if (!response.ok) throw new Error('Failed to fetch map key config');
    const data = await response.json();
    const appKey = data.kakaoKey;
    if (!appKey) { console.warn('Kakao map API key is empty'); return; }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.onload = () => {
      kakao.maps.load(() => {
        state.kakaoLoaded = true;
        state.geocoder = new kakao.maps.services.Geocoder();
        // Pre-initialize map centered on Seoul so the container has a valid size
        initKakaoMap(37.5665, 126.9780);
        console.log('Kakao Map API successfully loaded & geocoder initialized');
      });
    };
    script.onerror = () => console.error('Failed to load Kakao Map Script');
    document.head.appendChild(script);
  } catch (err) {
    console.error('Error loading Kakao Map SDK:', err);
  }
}

// Initialize map object centered at coordinate
function initKakaoMap(lat, lng) {
  if (!state.kakaoLoaded) return;
  if (state.map) {
    // Map already exists – just re-center
    state.map.setCenter(new kakao.maps.LatLng(lat, lng));
    return;
  }
  const container = document.getElementById('kakaoMap');
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 5
  };
  state.map = new kakao.maps.Map(container, options);
  const zoomControl = new kakao.maps.ZoomControl();
  state.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
}

// Convert address to coordinates and place interactive marker
// Center the map to the searched administrative district (Sido + Sigungu)
function moveMapToRegion(sido, sigunguText) {
  if (!state.kakaoLoaded || !state.geocoder || !state.map) return;
  
  const regionQuery = `${sido} ${sigunguText}`;
  state.geocoder.addressSearch(regionQuery, (res, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(parseFloat(res[0].y), parseFloat(res[0].x));
      state.map.setCenter(coords);
      state.map.setLevel(6); // Zoom level 6 is perfect for showing a whole district
    }
  });
}

// Clear all markers from the map and reset the array
function clearMarkers() {
  if (state.markers && state.markers.length > 0) {
    state.markers.forEach(marker => marker.setMap(null));
  }
  state.markers = [];
  if (state.mapInfoWindow) {
    state.mapInfoWindow.close();
  }
}

// Group transactions by apartment, perform geocoding, and render multiple markers on the map
function displayAllTransactionsOnMap() {
  if (!state.kakaoLoaded || !state.geocoder || !state.map) return;

  clearMarkers();

  const mapStatusText = document.getElementById('mapStatusText');
  mapStatusText.textContent = '아파트 위치 분석 및 다중 마커 생성 중...';

  // 1. Group transactions by unique apartment to prevent overlap and limit API abuse
  const aptGroups = {};
  state.processedTransactions.forEach(item => {
    const key = `${item.umdNm}_${item.aptNm}`;
    if (!aptGroups[key]) {
      aptGroups[key] = {
        aptNm: item.aptNm,
        umdNm: item.umdNm,
        jibun: item.jibun,
        transactions: []
      };
    }
    aptGroups[key].transactions.push(item);
  });

  const uniqueApts = Object.values(aptGroups);
  
  // To avoid hitting Kakao geocoding rate limits, we limit to the first 40 unique apartments
  const displayLimit = 40;
  const aptsToDisplay = uniqueApts.slice(0, displayLimit);

  let successCount = 0;
  let processedCount = 0;

  if (aptsToDisplay.length === 0) {
    mapStatusText.textContent = '표시할 거래 정보가 없습니다.';
    return;
  }

  aptsToDisplay.forEach((apt, index) => {
    const sido = sidoSelect.value;
    const sigunguText = sigunguSelect.options[sigunguSelect.selectedIndex].text;
    const cleanJibun = apt.jibun ? String(apt.jibun).trim() : '';
    
    // Geocoding addresses (3 stages fallback query)
    const addr1 = `${sido} ${sigunguText} ${apt.umdNm} ${cleanJibun}`.trim();
    const addr2 = `${sido} ${sigunguText} ${apt.umdNm} ${apt.aptNm}`;
    const addr3 = `${apt.aptNm} ${sido} ${sigunguText}`;

    function geocodeAndPlace(address, stage) {
      state.geocoder.addressSearch(address, (res, status) => {
        if (status === kakao.maps.services.Status.OK) {
          createAptMarker(parseFloat(res[0].y), parseFloat(res[0].x), apt);
          successCount++;
          
          processedCount++;
          if (processedCount === aptsToDisplay.length) {
            mapStatusText.textContent = `분석 완료: 총 ${uniqueApts.length}개 단지 중 ${successCount}개 단지 실거래 마커 표시 완료`;
          }
        } else {
          if (stage === 1) {
            geocodeAndPlace(addr2, 2);
          } else if (stage === 2) {
            geocodeAndPlace(addr3, 3);
          } else {
            processedCount++;
            if (processedCount === aptsToDisplay.length) {
              mapStatusText.textContent = `분석 완료: 총 ${uniqueApts.length}개 단지 중 ${successCount}개 단지 실거래 마커 표시 완료`;
            }
            console.warn(`모든 주소 검색 실패: ${apt.aptNm} (${address})`);
          }
        }
      });
    }

    // Call geocoder with a slight offset to prevent hitting requests/sec limits
    setTimeout(() => {
      geocodeAndPlace(addr1, 1);
    }, index * 50);
  });
}

// Create a single map marker representing an apartment building
function createAptMarker(lat, lng, apt) {
  const coords = new kakao.maps.LatLng(lat, lng);
  const marker = new kakao.maps.Marker({
    map: state.map,
    position: coords,
    title: apt.aptNm
  });

  // Attach dynamic identifying key to the marker
  marker.aptKey = `${apt.umdNm}_${apt.aptNm}`;
  state.markers.push(marker);

  // Bind click event to open details
  kakao.maps.event.addListener(marker, 'click', () => {
    openInfoWindowForApt(marker, apt);
  });
}

// Generate and overlay dynamic premium InfoWindow for a marker
function openInfoWindowForApt(marker, apt) {
  if (state.mapInfoWindow) state.mapInfoWindow.close();

  const txs = apt.transactions;
  const txCount = txs.length;
  
  // Find highest deal price
  const sortedByPrice = [...txs].sort((a, b) => b.dealAmount - a.dealAmount);
  const maxPriceText = formatKoreanPrice(sortedByPrice[0].dealAmount);
  
  // Find latest deal price
  const sortedByDate = [...txs].sort((a, b) => b.dealDate.localeCompare(a.dealDate));
  const latestTx = sortedByDate[0];
  const latestPriceText = formatKoreanPrice(latestTx.dealAmount);

  const pyeongSize = Math.round(latestTx.excluUseAr / 3.3);

  const iwContent = `
    <div class="kakao-infowindow">
      <div class="iw-title">${apt.aptNm}</div>
      <div class="iw-row"><span class="iw-label">당월 거래 건수</span><span class="iw-value" style="color:var(--color-success); font-weight:700;">${txCount}건</span></div>
      <div class="iw-row"><span class="iw-label">최고 거래가</span><span class="iw-value iw-price">${maxPriceText}</span></div>
      <div class="iw-row"><span class="iw-label">최신 거래가</span><span class="iw-value iw-price" style="color:var(--color-primary);">${latestPriceText}</span></div>
      <div class="iw-row"><span class="iw-label">대표 평형</span><span class="iw-value">${latestTx.excluUseAr.toFixed(1)}㎡ (~${pyeongSize}평)</span></div>
      <div class="iw-row"><span class="iw-label">층수/건축</span><span class="iw-value">${latestTx.floor}층 / ${latestTx.buildYear}년</span></div>
    </div>`;

  state.mapInfoWindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: true
  });
  
  state.mapInfoWindow.open(state.map, marker);
  state.map.panTo(marker.getPosition());
}

// Focus on an existing marker when table row is clicked, or fallback to single search
function focusApartmentOnMap(item) {
  const targetKey = `${item.umdNm}_${item.aptNm}`;
  const foundMarker = state.markers.find(m => m.aptKey === targetKey);

  if (foundMarker) {
    const txs = state.processedTransactions.filter(t => t.umdNm === item.umdNm && t.aptNm === item.aptNm);
    const aptInfo = {
      aptNm: item.aptNm,
      umdNm: item.umdNm,
      jibun: item.jibun,
      transactions: txs
    };
    openInfoWindowForApt(foundMarker, aptInfo);
  } else {
    // Fallback: If not rendered in multi-marker, render it as a single focused marker
    showSingleApartmentOnMap(item);
  }
}

// Fallback single geocoder logic to locate a specific apartment transaction on the fly
function showSingleApartmentOnMap(item) {
  if (!state.kakaoLoaded || !state.geocoder) return;
  if (!state.map) {
    initKakaoMap(37.5665, 126.9780);
  }

  const sido = sidoSelect.value;
  const sigunguText = sigunguSelect.options[sigunguSelect.selectedIndex].text;
  const cleanJibun = item.jibun ? String(item.jibun).trim() : '';
  const searchAddress = `${sido} ${sigunguText} ${item.umdNm} ${cleanJibun}`.trim();
  const fallback1 = `${sido} ${sigunguText} ${item.umdNm} ${item.aptNm}`;
  const fallback2 = `${item.aptNm} ${sido} ${sigunguText}`;

  const mapStatusText = document.getElementById('mapStatusText');
  mapStatusText.textContent = `단독 위치 분석 중: ${item.aptNm}...`;

  function placeSingleMarker(lat, lng, label) {
    const coords = new kakao.maps.LatLng(lat, lng);
    state.map.setCenter(coords);
    state.map.setLevel(4);
    
    // Clear previous single marker or multi infowindow if any
    if (state.mapInfoWindow) state.mapInfoWindow.close();
    
    const marker = new kakao.maps.Marker({ map: state.map, position: coords });
    state.markers.push(marker); // keep track of it

    const priceText = formatKoreanPrice(item.dealAmount);
    const pyeongSize = Math.round(item.excluUseAr / 3.3);
    const iwContent = `
      <div class="kakao-infowindow">
        <div class="iw-title">${item.aptNm}</div>
        <div class="iw-row"><span class="iw-label">거래 금액</span><span class="iw-value iw-price">${priceText}</span></div>
        <div class="iw-row"><span class="iw-label">전용 면적</span><span class="iw-value">${item.excluUseAr.toFixed(1)}㎡ (~${pyeongSize}평)</span></div>
        <div class="iw-row"><span class="iw-label">층수/건축</span><span class="iw-value">${item.floor}층 / ${item.buildYear}년</span></div>
      </div>`;
      
    state.mapInfoWindow = new kakao.maps.InfoWindow({ content: iwContent, removable: true });
    state.mapInfoWindow.open(state.map, marker);
    mapStatusText.textContent = `표시 중: ${item.aptNm} (${item.umdNm}) ${label}`;
  }

  state.geocoder.addressSearch(searchAddress, (res, status) => {
    if (status === kakao.maps.services.Status.OK) {
      placeSingleMarker(parseFloat(res[0].y), parseFloat(res[0].x), '');
    } else {
      state.geocoder.addressSearch(fallback1, (res2, status2) => {
        if (status2 === kakao.maps.services.Status.OK) {
          placeSingleMarker(parseFloat(res2[0].y), parseFloat(res2[0].x), '(이름검색)');
        } else {
          state.geocoder.addressSearch(fallback2, (res3, status3) => {
            if (status3 === kakao.maps.services.Status.OK) {
              placeSingleMarker(parseFloat(res3[0].y), parseFloat(res3[0].x), '(키워드검색)');
            } else {
              console.warn('모든 주소 검색 실패:', searchAddress);
              mapStatusText.textContent = `위치 검색 실패: ${item.aptNm}`;
            }
          });
        }
      });
    }
  });
}
