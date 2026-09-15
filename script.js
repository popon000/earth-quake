// 擬似的なブログ記事データ
const blogArticles = {
  "1": {
    category: "【記録】",
    tagClass: "tag-record",
    title: "南海トラフに備える：高校生の避難リュックの中身",
    date: "2026.09.10",
    content: `
      <p>南海トラフ巨大地震の発生確率が高まる中、私たち高校生が今すぐできる備えとして「防災リュックの作成」を行いました。</p>
      <h3>100円ショップで揃うおすすめ非常用グッズ</h3>
      <ul>
        <li>アルミ保温シート（防寒・雨よけ）</li>
        <li>LEDミニ懐中電灯＋予備電池</li>
        <li>携帯用トイレ（最低3回分）</li>
        <li>ウェットティッシュ＆非常用ホイッスル</li>
      </ul>
      <p>重量は約2.5kgに抑え、通学用リュックに常時入れておいても負担にならない工夫をしています。</p>
    `
  },
  "2": {
    category: "【知恵】",
    tagClass: "tag-knowledge",
    title: "家庭や学校での「ローリングストック」の実践",
    date: "2026.09.05",
    content: `
      <p>日常的に使う食品や水を多めに買い置きし、使った分だけ新しく買い足していく「ローリングストック」の実践方法です。</p>
      <h3>おすすめの備蓄品</h3>
      <ol>
        <li><strong>飲料水:</strong> 1人1日3リットル × 3日〜1週間分</li>
        <li><strong>非常食・缶詰:</strong> 温めずに食べられる缶詰やレトルト食品</li>
        <li><strong>生活必需品:</strong> トイレットペーパー、カセットコンロなど</li>
      </ol>
      <p>定期的に賞味期限をチェックして、身近なところから防災を始めましょう。</p>
    `
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 地震情報の取得
  fetchEarthquakeData();

  // 緊急モード切り替え機能
  const emergencyBtn = document.getElementById("emergency-btn");
  emergencyBtn.addEventListener("click", () => {
    document.body.classList.toggle("emergency-mode");
    if (document.body.classList.contains("emergency-mode")) {
      emergencyBtn.textContent = "緊急モード：ON";
      emergencyBtn.style.backgroundColor = "#ff0000";
    } else {
      emergencyBtn.textContent = "緊急モード：OFF";
      emergencyBtn.style.backgroundColor = "#dc2626";
    }
  });

  // モーダル機能
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close");
  const readMoreBtns = document.querySelectorAll(".read-more-btn");

  readMoreBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const articleId = e.target.getAttribute("data-article");
      const article = blogArticles[articleId];

      if (article) {
        document.getElementById("modal-category").textContent = article.category;
        document.getElementById("modal-category").className = `category ${article.tagClass}`;
        document.getElementById("modal-title").textContent = article.title;
        document.getElementById("modal-date").textContent = article.date;
        document.getElementById("modal-body").innerHTML = article.content;

        modalOverlay.classList.add("active");
      }
    });
  });

  modalCloseBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });
});

async function fetchEarthquakeData() {
  const statusEl = document.querySelector(".api-status");
  const listEl = document.getElementById("eq-list");

  try {
    const response = await fetch("https://api.p2pquake.net/v2/history?codes=551&limit=3");
    const data = await response.json();

    statusEl.style.display = "none";
    listEl.innerHTML = "";

    data.forEach(item => {
      const time = item.earthquake.time;
      const place = item.earthquake.hypocenter.name || "情報なし";
      const maxScale = formatScale(item.earthquake.maxScale);

      const li = document.createElement("li");
      li.className = "eq-item";
      li.innerHTML = `
        <div class="eq-time">${time} 発生</div>
        <div class="eq-place">${place}</div>
        <div class="eq-scale">最大震度: ${maxScale}</div>
      `;
      listEl.appendChild(li);
    });

  } catch (error) {
    console.error("地震データの取得に失敗しました:", error);
    statusEl.textContent = "データの取得に失敗しました。";
  }
}

function formatScale(scaleCode) {
  const scaleMap = {
    10: "1", 20: "2", 30: "3", 40: "4",
    45: "5弱", 50: "5強", 55: "6弱", 60: "6強", 70: "7"
  };
  return scaleMap[scaleCode] || "不明";
}