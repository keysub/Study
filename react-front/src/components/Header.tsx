//useNavigate  : 리액트 라우터(React Router)에서 제공하는 "페이지 이동을 시키는 리모컨" 같은 Hook
// 사용법 :  navigate("/about"); // "/about" 페이지로 이동! (브라우저 전체를 새로 불러오지 않고 필요한 컴포넌트만 갈아끼우기 때문에 매우 빠름)
import type { Menu } from "../menu";

//TypeScript를 사용하여 Props라는 이름의 인터페이스 만들기
// 부모 컴포넌트(App.tsx)가 자식 컴포넌트(Header.tsx 등)에게 데이터를 줄 때, "내가 주는 데이터는 정확히 이런 모양이어야 해!"라고 규칙을 정하는 것입니다.
// mainMenus: Menu[] : 메뉴 객체들이 담긴 배열을 mainMenus라는 이름으로
// activeMenu: Menu : 현재 선택된 단 하나의 메뉴 객체를 activeMenu라는 이름으로
// setActiveMenu: (menu: Menu) => void : 메뉴를 변경하는 함수  , 사용자가 메뉴를 클릭했을 때 부모의 상태를 바꾸는 리모컨 역할

interface Props {
  mainMenus: Menu[];
  activeMenu: Menu; 
  setActiveMenu: (menu: Menu) => void;
}

//export default : 이렇게 내보내면 다른 파일(App.tsx)에서 가져올 때 import Header from "./Header";처럼 중괄호 { } 없이 편하게 불러올 수 있음.
// 한 파일당 딱 한 번만 쓸 수 있습니다.
// { mainMenus, activeMenu, setActiveMenu }: Props (구조 분해 할당)
// 이렇게 안 하면 함수 내부에서 매번 props.mainMenus, props.activeMenu라고 길게 써야 하는데, 이 문법 덕분에 그냥 mainMenus라는 이름으로 바로 쓸 수 있어 코드가 깔끔해집니다.
// mainMenus.map() : JavaScript의 배열(Array) 메서드로,  배열 안의 각 데이터를 하나씩 꺼내옴
// key 속성을 사용하는 이유는 화면을 효율적으로 업데이트하기 위한 "이름표" 역할 
// { } 로 스크립트 삽입, { } 없으면 단순한 문자열로 인식
export default function Header({ mainMenus, activeMenu, setActiveMenu }: Props) {

  //함수 설정 onClick={() => handleMenuClick(menu)} 이런식으로 사용
  const topMenuClick = (menu: Menu) => {
    // 1. App.tsx의 상태를 업데이트 (이때 useEffect가 실행되어 하위 메뉴가 바뀜)
    setActiveMenu(menu); 

  };

  return (
    <div id="header">
      <div className="header-left">
        <div className="logo-area">
          <span className="logo-icon">⚛️</span>
          <span className="logo-text">React Study</span>
        </div>
      </div>
      <div className="header-center">
        <div className="header-menu">
          {mainMenus.map((menu) => (
            <div
              key={menu.menuId}
              // 현재 activeMenu 객체의 menuId와 비교하여 활성화 표시
              className={`menu-item ${activeMenu.menuId === menu.menuId ? "active" : ""}`}
              onClick={() => topMenuClick(menu)}
            >
              {menu.menuName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
