import { QUIZ_QUESTIONS, QUIZ_RESULTS } from '../data/quizData.js'

export const renderTeaQuiz = (container, orderUrl = '#') => {
  let currentStep = 0
  const userAnswers = []

  const render = () => {
    if (currentStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[currentStep]
      const progressPercent = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100

      container.innerHTML = `
        <div class="tea-quiz-card">
          <div class="quiz-header">
            <span class="quiz-kicker">MINI GAME TRẮC NGHIỆM</span>
            <h3 class="quiz-title">Khám Phá Gu Trà Chuẩn Vị Của Bạn</h3>
            <p class="quiz-subtitle">Chỉ 3 câu hỏi nhanh để tìm ra ly trà "chân ái" của Hẻm dành riêng cho bạn hôm nay.</p>
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <span class="quiz-step-label">Câu hỏi ${currentStep + 1} / ${QUIZ_QUESTIONS.length}</span>
          </div>

          <div class="quiz-body">
            <h4 class="question-text">${q.question}</h4>
            <p class="question-sub">${q.subtitle}</p>

            <div class="quiz-options-grid">
              ${q.options
                .map(
                  (opt) => `
                <button type="button" class="quiz-opt-btn" data-opt-id="${opt.id}">
                  <span class="opt-icon">${opt.icon}</span>
                  <span class="opt-label">${opt.label}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `

      container.querySelectorAll('.quiz-opt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          userAnswers.push(btn.dataset.optId)
          currentStep++
          render()
        })
      })
    } else {
      // Calculate outcome based on answer tags
      let resultKey = 'dam-vi'
      if (userAnswers.includes('kem-muoi') || userAnswers.includes('beo-ngot')) {
        resultKey = 'kem-muoi'
      } else if (userAnswers.includes('thanh-nhiet') || userAnswers.includes('tu-nhien') || userAnswers.includes('thach-gion')) {
        resultKey = 'trai-cay'
      }

      const res = QUIZ_RESULTS[resultKey] || QUIZ_RESULTS['dam-vi']

      container.innerHTML = `
        <div class="tea-quiz-card quiz-result-mode">
          <div class="result-header">
            <span class="quiz-kicker">KẾT QUẢ GU TRÀ CỦA BẠN</span>
            <div class="res-badge-pill">${res.badge}</div>
            <h3 class="result-drink-name">${res.title}</h3>
            <span class="result-price">${res.price}</span>
          </div>

          <div class="result-content-layout">
            <div class="result-image-box">
              <img src="${res.image}" alt="${res.title}" loading="lazy" decoding="async" />
            </div>
            <div class="result-info-box">
              <h4 class="result-drink-subtitle">${res.subtitle}</h4>
              <p class="result-drink-desc">${res.description}</p>
              <div class="result-tip-box">
                💡 <strong>Gợi ý:</strong> ${res.voucherTip}
              </div>
              <div class="result-actions">
                <a class="quiz-order-cta" href="${orderUrl}" target="_blank" rel="noopener noreferrer">
                  Đặt ly này ngay ➔
                </a>
                <button type="button" class="quiz-retry-btn">
                  🔄 Làm lại trắc nghiệm
                </button>
              </div>
            </div>
          </div>
        </div>
      `

      container.querySelector('.quiz-retry-btn')?.addEventListener('click', () => {
        currentStep = 0
        userAnswers.length = 0
        render()
      })
    }
  }

  render()
}
