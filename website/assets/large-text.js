(() => {
  const english = document.documentElement.lang === 'en';
  const key = 'fci-large-text-level';
  let level = 0;
  try { level = Number(localStorage.getItem(key)) || 0; } catch (_) {}
  level = level > 0 ? 1 : 0;
  const buttons = document.querySelectorAll('.text-size-control');
  const textElements = [...document.querySelectorAll('h1,h2,h3,p,a,button,span,small,strong,em,li,td,th,label,figcaption,.flow-detail')];
  let baseSizes = [];
  function measure() {
    document.body.removeAttribute('data-text-size');
    textElements.forEach(element => element.style.removeProperty('font-size'));
    baseSizes = textElements.map(element => parseFloat(getComputedStyle(element).fontSize));
  }
  measure();
  function apply() {
    document.body.dataset.textSize = String(level);
    textElements.forEach((element, index) => {
      if (level) element.style.fontSize = (baseSizes[index] * 1.2) + 'px';
      else element.style.removeProperty('font-size');
    });
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(level > 0));
      button.setAttribute('aria-label', ['글씨 크기: 기본. 20% 크게 보기', '글씨 크기: 20% 확대. 기본으로 돌아가기'][level]);
      button.title = (english ? ['Default text', '20% larger text'] : ['기본 글씨', '20% 큰 글씨'])[level];
      if (english) button.setAttribute('aria-label', level ? 'Text size: 20% larger. Restore default size' : 'Text size: default. Increase by 20%');
      button.innerHTML = level === 0 ? '가<span aria-hidden="true">+</span>' : '가<span aria-hidden="true">−</span>';
      if (english) button.innerHTML = button.innerHTML.replace('가', 'A');
      if (document.documentElement.lang === 'es') { button.innerHTML=button.innerHTML.replace('가','A');button.title=level?'Texto un 20% más grande':'Texto normal';button.setAttribute('aria-label',level?'Texto ampliado un 20%. Volver al tamaño normal':'Ampliar el texto un 20%'); }
      if (document.documentElement.lang.startsWith('zh')) { button.innerHTML = button.innerHTML.replace('가', '字'); button.setAttribute('aria-label', level ? '文字大小：放大20%。恢复标准大小' : '文字大小：标准。放大20%'); button.title = level ? '20%' : '100%'; }
      if (document.documentElement.lang === 'ja') { button.innerHTML = button.innerHTML.replace('가', 'あ'); button.title = level ? '文字を20%拡大' : '標準の文字サイズ'; button.setAttribute('aria-label', level ? '文字サイズ：20%拡大。標準に戻す' : '文字サイズ：標準。20%拡大する'); }
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    level = (level + 1) % 2;
    try { localStorage.setItem(key, String(level)); } catch (_) {}
    apply();
  }));
  window.addEventListener('resize', () => { measure(); apply(); });
  apply();
})();
