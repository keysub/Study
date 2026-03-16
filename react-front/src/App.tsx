//import {... }  from "react" : React 라이브러리에서 특정 기능(Hooks)을 가져와 사용하겠다는 선언
//{ useState, useEffect }: React가 제공하는 수많은 기능 중 상태 관리와 부수 효과(Side Effect) 처리를 위한 두 가지 도구만 가져옴
//useState: 함수형 컴포넌트에서 데이터(상태)를 만들고 바꿀 때 사용. 값이 변하면 화면이 자동으로 다시 그려짐.
//useEffect: 컴포넌트가 화면에 나타날 때, 사라질 때, 혹은 특정 값이 변할 때 실행할 코드를 작성. 주로 데이터 불러오기(API 호출)나 이벤트 리스너 등록 등에 쓰임.
import { useState, useEffect } from "react";

//리액트 앱에서 "페이지 이동 기능(라우팅)"을 구현하기 위해 react-router-dom 라이브러리의 핵심 부품들을 가져오는 코드
//리액트 페이지가 하나뿐인 SPA(Single Page Application)인 경우, 이 도구들을 사용하면 마치 여러 페이지가 있는 것처럼 주소(URL)에 따라 다른 화면을 보여줄 수 있습
//BrowserRouter: 라우팅 기능을 사용할 전체 영역을 감싸는 부모입니다. 브라우저의 주소창과 리액트 앱을 연결하여 주소 변경을 감지
//Routes: 여러 개의 Route를 묶어주는 울타리입니다. 현재 주소와 일치하는 단 하나의 Route를 찾아 화면에 그려주는 역할
//Route : "어떤 주소(path)에서 어떤 컴포넌트(element)를 보여줄지" 정의하는 규칙
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";

//import Header: 불러온 기능을 이 파일 안에서 Header라는 이름으로 부르겠다
// 해당 디렉토리에서 .js 또는 .jsx, 또는 .tsx 파일을 가져옴
// 내보낼 때: export default WbsExecution;과 같이 default 키워드를 사용, 한 모듈당 하나만 존재할 수 있음
// 가져올 때: 중괄호 {} 없이 이름을 자유롭게 지어서 가져올 수 있음
// 용도: 주로 그 파일의 주인공(메인 컴포넌트)을 불러올 때 씁니다.
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import WbsSetup from "./pages/WbsSetup";
import WbsExecution from "./pages/WbsExecution";
//fetch 함수
// TypeScript 환경에서 특정 파일(./menu)로부터 기능과 타입 정의를 한꺼번에 가져옴
// fetchTopMenus, selectSubMenus: ./menu 파일에서 export된 함수나 변수들
// type Menu: Menu가 데이터의 형태(타입/인터페이스)임을 명시
// 이 방식은 파일에서 여러 개를 내보냈을 때, 그중 필요한 것들만 골라서 가져올 때 사용
// 내보낼 때: 각 변수나 함수 앞에 export const ...를 붙여 여러 개를 내보냅
// 가져올 때: 반드시 중괄호 {} 안에 원래 이름과 똑같은 이름을 적어야 함
// 용도: 유틸리티 함수 모음, API 호출 함수 모음, 여러 개의 타입 정의 등을 한 파일에 관리할 때 씀
import { fetchTopMenus, fetchSubMenus, type Menu } from "./menu";


// CSS 경로는 프로젝트 구조에 따라 './css/layout.css' 등으로 수정이 필요할 수 있습니다.
import "./css/layout.css"; 

// function App() { : 함수형 컴포넌트, 리액트(React) 애플리케이션의 뿌리가 되는 가장 기본 단위, 즉 메인 컴포넌트를 정의하는 코드
// 쉽게 비유하자면, 레고 블록으로 성을 쌓을 때 '성 전체를 담고 있는 가장 큰 판'임
// 리액트에서 컴포넌트의 이름은 반드시 대문자(App)로 시작해야 함
// 반환값(Return): 함수 안에서 return ( ... ); 구문을 통해 화면에 어떤 내용을 그려줄지 결정함. 이때 사용하는 문법을 JSX라고 부름

/* 코드 구조 뜯어보기
보통 다음과 같은 흐름으로 작성

function App() {
  // 1. 논리(Logic) 영역: 변수 선언, 데이터 불러오기, useState/useEffect 사용
  const name = "사용자";

  // 2. 출력(View) 영역: 화면에 보여줄 HTML 구조(JSX)를 리턴
  return (
    <div className="App">
      <h1>안녕하세요, {name}님!</h1>
      <Header />  {// 아까 import 했던 Header 컴포넌트를 여기서 사용  }
    </div>
  );
}

export default App; // 다른 파일(index.js 등)에서 이 앱을 불러다 쓸 수 있게 내보냄

*/

function App() {
	
  /*  전체적인 사용 흐름
  import { useState, useEffect } from "react";
  import { fetchTopMenus, type Menu } from "./menu"; // 아까 본 import 문

  function App() {
    // 1. 빈 상자([])를 준비합니다.
    const [mainMenus, selectTopMenus] = useState<Menu[]>([]);

    useEffect(() => {
      // 2. 서버에서 데이터를 가져오는 함수를 실행합니다.
      const loadMenus = async () => {
        const data = await fetchTopMenus(); // 데이터를 가져와서
        selectTopMenus(data); // 상자(mainMenus)에 담습니다. (화면 자동 갱신)
      };

      loadMenus();
    }, []);

    return (
      <nav>
        <ul>
          {// 3. 상자에 담긴 데이터를 하나씩 꺼내서 화면에 그립니다.}
          {mainMenus.map((menu) => (
            <li key={menu.id}>
              {menu.name}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  */
  //  상세 소스 분석	
  // 1. 빈 상자([])를 준비합니다.
  //리액트의 useState는 항상 [현재 값, 값을 바꾸는 함수] 두 개를 담은 배열을 반환함.
  // mainMenus: 현재 저장된 데이터 값 그 자체, selectTopMenus: 변경할 때 사용하는 전용 함수
  // useState(...): "상태(State)를 만들겠다"는 리액트 useState 훅(Hook)의 선언
  // <Menu[]> (TypeScript 문법): 이 상자에는 Menu라는 형태를 가진 데이터의 배열([])만 넣겠다
  // ([]): 괄호 안의 값은 초깃값, 처음에 데이터가 없을 때는 빈 리스트([])로 시작하겠다는 뜻 null 은 단일항목일때 , 빈 배열은 데이터가 배열일때
  const [mainMenus, selectTopMenus] = useState<Menu[]>([]);
  // <Menu | null> (유니온 타입): Menu 아니면 null이 들어올 수 있다는 뜻
  // (null): 앱을 처음 켰을 때는 사용자가 아무 메뉴도 클릭하지 않았으므로, **초깃값을 null**로 설정
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null); 
  const [level2Menus, selectSubMenus] = useState<Menu[]>([]);
  const [activeLevel2, setActiveLevel2] = useState<Menu | null>(null);

  /*
  2. 서버에서 데이터를 가져오는 함수를 실행합니다.

  코드 형태	실행 시점
  useEffect(() => { ... });	(배열 없음) 렌더링될 때마다 매번 실행
  useEffect(() => { ... }, []);	(빈 배열) 처음 로딩될 때 딱 한 번만 실행
  useEffect(() => { ... }, [v]); 처음 로딩될 때 + v가 바뀔 때마다 실행
  
  함수정의 (...) => { ... } →  옛날방식 : function(...) { ... }
  */
 
  // [STEP 1] 앱 로딩 시: DB에서 1차 메뉴부터 가져오기
  useEffect(() => {
	// React 는 동기(Sync) 식 보통은 사용안함
	// 비동기(async) 함수 안에서는 await 사용가능 (다음줄로 넘어가지 않고 기다림)
	//  Promise.all :  await 서로 상관없는 데이터를 한꺼번에 가져올 때 속도높임
	// 	const [menus, user] = await Promise.all([
	// 	fetchTopMenus(),
	// 	fetchUserInfo()
	// 	]);
    const initMenus = async () => {
      try {
        const data = await fetchTopMenus();
        selectTopMenus(data);
        if (data.length > 0) setActiveMenu(data[0]); // 여기서 첫 메뉴 설정
      } catch (error) {
        console.error(error);
      }
    };
    initMenus();
  }, []); // 빈 배열: 처음 로딩될 때 딱 한 번만 실행
  
  
  // [STEP 2] 1차 메뉴 변경 시: 해당되는 2차 메뉴 DB에서 가져오기
  useEffect(() => {
    if (!activeMenu) return;

    const loadLevel2 = async () => {
      try {
        const menus = await fetchSubMenus(activeMenu.menuId);
        selectSubMenus(menus);
        setActiveLevel2(menus[0] || null);
      } catch (error) {
        console.error("2차 메뉴 로드 실패:", error);
      }
    };
    loadLevel2();
  }, [activeMenu]); //처음 로딩될 때 + activeMenu가 바뀔 때마다 실행

  
    // 3. 상자에 담긴 데이터를 하나씩 꺼내서 화면에 그립니다.
	
    // 데이터 로딩 전 예외 처리
    if (mainMenus.length === 0 || !activeMenu) {
      return <div>메뉴 데이터를 불러오는 중입니다...</div>;
    }

    return (
	  // <BrowserRouter> : 		전체 화면을 라우팅(페이지 이동) 기능으로 감싸는 울타리입니다. 이 안에 있는 컴포넌트들은 주소(URL) 변경에 반응할 수 있음
	  //<Header ... /> : 사용자가 직접 만든 Header 컴포넌트를 화면에 그리겠다는 뜻
	  // <Routes>는 React Router 라이브러리에서 웹 페이지의 "이정표(지도)" 역할을 하는 컴포넌트입니다.
	  // 사용자가 브라우저 주소창에 입력한 URL 경로(Path)와 우리가 만든 컴포넌트(Element)를 연결해주는 핵심 장치입니다. 
	  // 경로 매칭: 현재 브라우저의 URL 주소를 확인하고, 그 안에 포함된 여러 <Route> 중 주소가 일치하는 단 하나의 컴포넌트만 화면에 그려줍니다
	  // 화면 전환 (SPA): 페이지 전체를 새로고침하지 않고, URL이 바뀔 때 #mainContent 영역의 내용물만 슥슥 바꿔 끼워줍니다.
	  // <Route ... : React Router를 사용하여 특정 주소(URL)에 특정 컴포넌트를 연결하고, 그 컴포넌트에 필요한 데이터와 기능을 전달하는 설정
	  //  <Route  path="경로"  element={<화면 컴포넌트명 데이터={실제값} 기능={실제함수} />}  />
	  // path="/pages/dashboard"	 : 주소 설정	브라우저 주소창에 이 경로가 입력되었을 때 이 라우트가 활성화됩니다.
	  // 데이터 예시 : level2Menus	데이터 전달	대시보드 안에서 보여줄 2단계 메뉴 목록(배열)을 전달합니다.
	  // 기능 예시 : onSelect	기능 전달	메뉴를 클릭했을 때 실행될 함수(setActiveLevel2)를 전달
	   
	  
      <BrowserRouter basename="/react">
        <Header
          mainMenus={mainMenus}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <div id="layout">
          <Sidebar
            parentMenuName={activeMenu.menuName}
            level2Menus={level2Menus}
            selectSubMenus={selectSubMenus}
            activeLevel2={activeLevel2}
            setActiveLevel2={setActiveLevel2}
          />
          <div id="mainContent">
            <Routes>
			  {/* 접속 시 주소를 /pages/dashboard로 강제 이동시킵니다 */}
			  <Route path="/" element={<Navigate to="/pages/dashboard" replace />} />
			   
			  {/* 실제 컴포넌트 매핑 */}
              <Route path="/pages/dashboard" element={<Dashboard level2Menus={level2Menus} activeLevel2={activeLevel2} onSelect={setActiveLevel2} />} />
              <Route path="/pages/userManagement" element={<UserManagement level2Menus={level2Menus} activeLevel2={activeLevel2} onSelect={setActiveLevel2} />} />
			  <Route path="/pages/wbsSetup" element={<WbsSetup/>} />
              <Route path="/pages/wbsExecution"element={<WbsExecution/>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  //export default : 이렇게 내보내면 다른 파일(main.tsx)에서 가져올 때 import App from "./App";처럼 중괄호 { } 없이 편하게 불러올 수 있음.
  // 한 파일당 딱 한 번만 쓸 수 있습니다.
  export default App;
