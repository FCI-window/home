# 언어·스토리 페이지 이동 전 로딩 화면 적용 가이드

## 목적

언어 감지 또는 저장된 언어 설정에 따라 실제 페이지로 이동하기 전, 빈 화면이나 흰색 화면이 잠깐 보이는 현상을 줄인다.

페이지 이동 전에도 다음 요소를 먼저 보여 준다.

- 실제 페이지와 같은 배경색
- 좌측 상단 FCI 로고
- 화면 낭독기를 위한 로딩 안내 문구

이 방식은 홈페이지와 각 스토리 페이지의 언어 선택용 중간 페이지에 동일하게 적용한다.

## 기본 원칙

1. `body`의 배경색은 이동할 페이지의 첫 화면 배경색과 동일하게 지정한다.
2. 로고는 JavaScript보다 먼저 HTML에 배치한다.
3. 로고 파일은 상대 경로를 사용한다.
4. 페이지 이동 로직은 기존의 언어 감지·저장 언어 로직을 그대로 유지한다.
5. 로딩 문구는 시각적으로 숨기되, 접근성 정보로는 남긴다.
6. 실제 페이지가 로드된 뒤에는 이 중간 화면이 브라우저 뒤로가기에 남지 않도록 `location.replace()`를 사용한다.

## 기본 HTML 구조

```html
<style>
  html, body {
    margin: 0;
    min-height: 100%;
    background: #202633;
  }

  body {
    color: #edf2f8;
    font-family: system-ui, sans-serif;
  }

  .loading-screen {
    min-height: 100vh;
    padding: 42px 28px;
  }

  .loading-logo {
    display: block;
    width: min(158px, 42vw);
    height: auto;
  }

  .loading-message {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>

<main class="loading-screen" aria-label="FCI loading">
  <img
    class="loading-logo"
    src="../images/FCILOGOwithTextWhite.png"
    alt="FCI Factory of Creative Imagination"
  >
  <p class="loading-message">Loading FCI…</p>
</main>
```

## 경로별 로고 경로

중간 페이지의 위치에 따라 로고의 상대 경로를 바꾼다.

| 파일 위치 | 로고 경로 |
|---|---|
| `/index.html` | `./images/FCILOGOwithTextWhite.png` |
| `/fci/index.html` | `../images/FCILOGOwithTextWhite.png` |
| `/rab/index.html` | `../images/FCILOGOwithTextWhite.png` |
| `/rohd/index.html` | `../images/FCILOGOwithTextWhite.png` |
| `/dream/index.html` | `../images/FCILOGOwithTextWhite.png` |

실제 언어 페이지에서 사용하는 로고가 다른 경우에는 해당 페이지의 로고 파일과 색상을 맞춘다.

## 언어 이동 스크립트

로고를 먼저 렌더링한 뒤 기존 언어 감지 로직을 실행한다.

```html
<script>
  (() => {
    const languages = navigator.languages || [navigator.language || ""];
    let savedLanguage = "";

    try {
      savedLanguage = localStorage.getItem("fci-language") || "";
    } catch (_) {}

    const language = savedLanguage ||
      (languages.some(value => /^ko(?:-|$)/i.test(value)) ? "ko" : "en");

    location.replace(language === "ko" ? "./ko/" : "./en/");
  })();
</script>
```

스토리 페이지에서는 위의 목적지 경로만 해당 언어 페이지에 맞게 변경한다. 예를 들어 FCI 스토리 페이지라면 다음과 같이 연결한다.

```js
location.replace(language === "ko" ? "./index_ko.html" : "./index_en.html");
```

## 적용하지 말아야 할 방식

- 로고를 JavaScript로 생성하지 않는다.
- 로고를 CSS의 `background-image`로만 넣지 않는다. 이미지 로딩 지연이나 접근성 문제가 생길 수 있다.
- 중간 페이지에 흰색 배경을 사용하지 않는다.
- 언어 감지 전에 긴 애니메이션이나 지연 시간을 넣지 않는다.
- 파일명과 경로를 서비스 표시명 변경과 함께 바꾸지 않는다.

## 확인 항목

- 새로고침 직후 흰 화면 대신 동일한 배경과 FCI 로고가 보이는가?
- 한국어 브라우저와 영어 브라우저에서 올바른 언어 페이지로 이동하는가?
- `localStorage`의 `fci-language` 설정이 우선 적용되는가?
- 모바일 화면에서 로고가 잘리지 않는가?
- JavaScript가 꺼져 있어도 `noscript` 언어 링크가 보이는가?
- `git diff --check`에서 공백 오류가 없는가?

