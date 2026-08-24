# FCI 다국어 웹사이트 운영 매뉴얼

## 1. 운영 방향

FCI는 메인 페이지와 서비스 상세 페이지를 분리해 다국어로 운영한다.

- 메인 페이지: 언어별 폴더 사용
- 서비스 상세 페이지: 서비스 폴더 안에서 언어별 본문 파일 사용
- 서비스의 공통 주소: 서비스 폴더의 index.html
- 언어를 확실히 지정하는 링크: ?lang=ko 또는 ?lang=en

언어 코드는 국가 코드가 아니라 언어 코드를 사용한다.

- 한국어: ko
- 영어: en
- 일본어: ja
- 중국어 간체: zh-CN
- 중국어 번체: zh-TW

한국어를 kr로 표기하지 않는다.

## 2. 메인 페이지 구조

~~~text
/
├── index.html          # 전체 사이트 언어 감지
├── ko/
│   └── index.html      # 한국어 메인
├── en/
│   └── index.html      # 영어 메인
├── rab/
├── dream/
├── rohd/
└── paran/
~~~

루트 /index.html은 브라우저 언어를 확인하여 /ko/ 또는 /en/으로 이동시키는 진입 페이지다.

현재 분기 규칙:

1. localStorage에 사용자가 선택한 언어가 있으면 그 언어를 사용한다.
2. 브라우저 언어가 ko로 시작하면 /ko/로 이동한다.
3. 그 외에는 /en/으로 이동한다.
4. JavaScript를 사용할 수 없으면 수동 링크를 표시한다.

## 3. 서비스 상세 페이지의 목표 구조

서비스별로 공통 진입 페이지와 언어별 본문을 둔다.

~~~text
/dream/
├── index.html          # 언어 감지·분기용
├── index_ko.html       # 한국어 본문
├── index_en.html       # 영어 본문
└── images/             # 서비스 공통 이미지

/rohd/
├── index.html
├── index_ko.html
├── index_en.html
└── images/

/rab/
├── index.html
├── index_ko.html
├── index_en.html
└── images/
~~~

파란은 현재 다국어 상세 페이지 대상에서 제외한다.

한국어 파일명은 index_kr.html이 아니라 index_ko.html을 사용한다.

## 4. 서비스 링크 작성 규칙

언어 메인 페이지에서는 서비스의 공통 주소에 언어 파라미터를 붙인다.

한국어 메인:

~~~html
<a href="../dream/?lang=ko">스토리 보기 &gt;</a>
~~~

영어 메인:

~~~html
<a href="../dream/?lang=en">View story &gt;</a>
~~~

이렇게 해야 사용자의 기기 언어와 관계없이 사용자가 현재 보고 있는 언어의 상세 페이지로 이동한다.

언어 파라미터가 없는 공통 주소도 외부 공유용으로 사용할 수 있다.

~~~text
https://www.fciapp.com/dream/
~~~

이 경우 /dream/index.html이 다음 순서로 언어를 결정한다.

1. URL의 lang 파라미터
2. 저장된 언어 선택
3. 브라우저 언어
4. 기본 언어

## 5. 서비스 분기 페이지 구현 규칙

/dream/index.html, /rohd/index.html, /rab/index.html은 본문을 직접 포함하지 않고 언어별 파일로 이동시킨다.

동작 예시:

~~~text
/dream/?lang=ko → /dream/index_ko.html
/dream/?lang=en → /dream/index_en.html
/dream/          → 브라우저 언어에 따라 분기
~~~

분기 예시:

~~~html
<script>
  (() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("lang");
    const supported = ["ko", "en"];

    let saved = "";
    try {
      saved = localStorage.getItem("fci-language") || "";
    } catch (_) {}

    const browserLanguage =
      (navigator.languages || [navigator.language || ""])
        .find(value => supported.some(code => value.toLowerCase().startsWith(code)));

    const language =
      supported.includes(requested) ? requested :
      supported.includes(saved) ? saved :
      browserLanguage ? browserLanguage.slice(0, 2) :
      "en";

    location.replace("./index_" + language + ".html");
  })();
</script>
~~~

실제 파일에서는 서비스명에 맞는 언어 목록과 기본 언어를 확인한다.

## 6. 언어별 본문 파일 운영

언어별 본문 파일은 서비스 폴더 안에 둔다.

~~~text
/dream/index_ko.html
/dream/index_en.html
/rohd/index_ko.html
/rohd/index_en.html
/rab/index_ko.html
/rab/index_en.html
~~~

서비스의 이미지와 스타일은 가능한 한 서비스 폴더 안에서 공유한다.

- 서비스 내부 이미지: ./images/...
- 서비스 공통 CSS: ./styles.css
- 루트 공통 이미지가 필요한 경우: ../images/...
- 공통 정책문서: ../documents/...

새 언어를 추가할 때는 index_ja.html처럼 같은 서비스 폴더 안에 파일을 추가한다.

## 7. 영어 페이지가 아직 없는 경우

영어 본문이 준비되지 않았어도 index_en.html 파일은 먼저 만들 수 있다.

준비 페이지 예시:

~~~html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DRE&amp;M | English page coming soon</title>
</head>
<body>
  <p>English page coming soon.</p>
  <p><a href="./index_ko.html">한국어</a></p>
</body>
</html>
~~~

나중에 실제 번역 본문으로 파일을 교체한다.

## 8. 정책문서 운영 규칙

최신 정책문서는 documents/ 아래에서 관리한다.

현재 한국어 정책문서:

~~~text
documents/RAB_Privacy_Policy_KR.html
documents/RAB_TermsandConditions_KR.html
documents/ROHD_Privacy_Policy_KR.html
documents/ROHD_TermsandConditions_KR.html
documents/DREAM_Privacy_Policy_KR.html
documents/DREAM_TermsandConditions_KR.html
documents/PARAN_Privacy_Policy_KR.html
documents/PARAN_TermsandConditions_KR.html
~~~

영어 문서:

~~~text
documents/RAB_Privacy_Policy_EN.html
documents/RAB_TermsandConditions_EN.html
documents/ROHD_Privacy_Policy_EN.html
documents/ROHD_TermsandConditions_EN.html
documents/DREAM_Privacy_Policy_EN.html
documents/DREAM_TermsandConditions_EN.html
~~~

페이지 언어와 정책문서 언어를 일치시킨다.

- 한국어 페이지 → *_KR.html
- 영어 페이지 → *_EN.html
- 일본어 페이지 → *_JA.html
- 중국어 간체 페이지 → *_ZH_CN.html
- 중국어 번체 페이지 → *_ZH_TW.html

정책문서 링크는 본문 파일의 위치를 기준으로 작성한다.

예를 들어 /dream/index_ko.html에서는 다음처럼 연결한다.

~~~html
<a href="../documents/DREAM_Privacy_Policy_KR.html">
  개인정보처리방침
</a>
~~~

## 9. 기존 주소 보존 및 전환

기존 주소는 삭제하지 않는다.

~~~text
/rab/
/dream/
/rohd/
/paran/
~~~

기존 주소를 서비스 언어 분기 페이지로 바꾸더라도 실제 한국어 본문은 별도로 보존한다.

예시:

~~~text
기존 /dream/index.html 본문
→ /dream/index_ko.html

새 /dream/index.html
→ 언어 분기 전용
~~~

기존 주소는 앱, 검색엔진, 블로그, 외부 공유 링크에서 사용될 수 있으므로 이동 전에 본문 복사와 링크 점검을 완료한다.

## 10. 작업 순서

기존에 `/ko/{service}/` 안에 본문이 있는 서비스를 전환할 때는 다음 순서를 따른다.
`{service}`에는 `dream`, `rohd`, `rab` 등을 넣는다.

1. 기존 서비스 폴더를 별도 백업한다.

~~~text
/ko/{service}/
→ 별도 백업본 보관
~~~

2. 기존 한국어 본문을 서비스 루트의 언어별 파일로 복사한다.

~~~text
/ko/{service}/index.html
→ /{service}/index_ko.html
~~~

3. 기존 서비스 이미지를 서비스 루트의 공통 이미지 폴더로 복사한다.

~~~text
/ko/{service}/images/
→ /{service}/images/
~~~

4. 이동한 `index_ko.html`의 상대경로를 수정한다.

- `./images/...`는 그대로 유지한다.
- 기존 루트 공통 이미지 경로가 `../../images/...`라면 `../images/...`로 조정한다.
- 홈 링크가 의도한 루트 또는 언어 메인 페이지로 연결되는지 확인한다.
- 정책문서 링크, 다운로드 링크, CSS·스크립트 경로를 새 파일 위치 기준으로 확인한다.

5. 서비스 루트의 `index.html`을 언어 분기 전용 파일로 교체한다.

~~~text
/{service}/?lang=ko → ./{service}/index_ko.html
/{service}/?lang=en → ./{service}/index_en.html
/{service}/          → 저장 언어 또는 브라우저 언어에 따라 분기
~~~

분기 페이지에는 본문을 넣지 않고, `lang` 값이 없거나 지원하지 않는 값일 때 사용할 기본 언어도 정한다.

6. 아직 번역되지 않은 언어는 준비 페이지로 만든다.

~~~text
/{service}/index_en.html
→ 번역 준비 중 안내 및 한국어 페이지 링크
~~~

7. 메인 페이지의 서비스 링크를 언어가 보장되는 주소로 수정한다.

~~~html
<a href="../dream/?lang=ko">스토리 보기 &gt;</a>
~~~

8. 다음 주소를 순서대로 테스트한다.

~~~text
/{service}/
/{service}/?lang=ko
/{service}/?lang=en
/{service}/index_ko.html
~~~

각 페이지에서 이미지 확대, 모바일 레이아웃, 홈 링크, 앱 다운로드 링크, 정책문서 링크도 확인한다.

9. 언어별 본문 파일의 `lang`, `title`, meta description, Open Graph 문구, `alt`, `aria-label`을 확인한다.

10. 새 구조가 정상적으로 동작한 뒤에도 기존 `/ko/{service}/` 주소는 바로 삭제하지 않는다. 기존 방문자를 새 서비스 주소로 연결하거나, 일정 기간 기존 주소를 보존한다.

11. 마지막으로 Git diff, 파일 존재 여부, 깨진 상대경로를 점검한다. 확인이 끝난 뒤 커밋과 배포를 진행한다.

## 11. SEO와 공유 규칙

언어별 본문 파일에는 올바른 lang 속성을 사용한다.

~~~html
<html lang="ko">
~~~

~~~html
<html lang="en">
~~~

언어별 본문을 검색엔진에 노출할 때는 각 파일에 canonical과 hreflang을 추가하는 것을 검토한다.

분기 전용 index.html에는 noindex를 사용할 수 있다. 검색엔진에는 실제 언어별 본문 파일이 노출되는 것이 바람직하다.

일반 홍보·공유에는 다음 공통 주소를 사용한다.

~~~text
https://www.fciapp.com/dream/
~~~

특정 언어를 확실히 지정해야 할 때는 다음을 사용한다.

~~~text
https://www.fciapp.com/dream/?lang=ko
https://www.fciapp.com/dream/?lang=en
~~~

## 12. 점검 명령

~~~bash
git status --short
rg --files dream rohd rab documents
rg -n 'href=|src=|lang=|lang=' dream rohd rab
git diff --check
~~~

분기 대상 파일이 모두 있는지 확인한다.

~~~text
dream/index.html
dream/index_ko.html
dream/index_en.html
rohd/index.html
rohd/index_ko.html
rohd/index_en.html
rab/index.html
rab/index_ko.html
rab/index_en.html
~~~

## 13. 주의사항

- 한국어 파일은 index_kr.html이 아니라 index_ko.html로 만든다.
- 메인 페이지 링크에는 /dream/처럼 공통 주소만 쓰지 말고, 언어를 보장하려면 ?lang=ko 또는 ?lang=en을 붙인다.
- 분기 페이지와 본문 페이지를 같은 파일에 섞지 않는다.
- 기존 서비스 페이지를 바로 삭제하지 않는다.
- 이미지와 CSS는 가능하면 서비스 폴더 안에서 공유한다.
- 정책문서는 최신 documents/ 파일을 사용한다.
- notice_*, *Link/, app-ads.txt, .well-known/은 외부 사용 가능성이 있으므로 별도 확인 없이 삭제하지 않는다.
- backupYYYYMMDD/에 보관한 파일도 GitHub Pages에서는 웹으로 접근될 수 있다.
