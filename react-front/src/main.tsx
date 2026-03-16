import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/layout.css"; // src/main.tsx 기준 같은 위치의 css 폴더

//document.getElementById("root") : 내 프로젝트의 public/index.html 파일을 보면 <div id="root"></div>라는 빈 상자가 하나 있습니다. 그 상자를 찾아오라는 명령입니다.
// ! (Non-null Assertion) :  TypeScript 의 Non-null 연산자
// ReactDOM.createRoot(...)리액트 18 버전부터 도입된 새로운 방식입니다. 찾은 root 자리에 리액트 전용 뿌리(Root)를 만듭니다. 이제부터 이 안의 내용은 리액트가 관리하게 됩니다.
// .render(<App />) : "방금 만든 뿌리에 우리가 만든 <App /> 컴포넌트를 그려넣어!"라는 최종 명령입니다.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);