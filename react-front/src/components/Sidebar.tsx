import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { type Menu } from "../menu";

interface Props {
  parentMenuName: string;
  level2Menus: Menu[];
  selectSubMenus: (menus: Menu[]) => void;
  activeLevel2: Menu | null;
  setActiveLevel2: (menu: Menu | null) => void; 
}

export default function Sidebar({
  parentMenuName,
  level2Menus,
  activeLevel2,
  setActiveLevel2,
}: Props) {
	
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로를 가져옴
	
  const [open, setOpen] = useState(true);

  const sideMeneClick = (menu: Menu) => {
    setActiveLevel2(menu);
    if (menu.menuUrl) navigate(menu.menuUrl);
  };
  
  // activeLevel2가 변경될 때마다 실행 (자동 이동 포함)
  useEffect(() => {
    // 1. 선택된 메뉴가 있고 URL이 있는지 확인
    if (activeLevel2 && activeLevel2.menuUrl) {
      // 2. 핵심: 현재 브라우저 주소와 이동할 메뉴의 주소가 다를 때만 navigate!
      // 이렇게 하면 App에서 첫 번째 메뉴를 세팅했을 때도 자동으로 이동합니다.
      if (location.pathname !== activeLevel2.menuUrl) {
        navigate(activeLevel2.menuUrl);
      }
    }
  }, [activeLevel2, navigate, location.pathname]);
  
  return (
    <div id="sidebar">
      <div className="sidebar-group">
        <div className="sidebar-title" onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
          📁 {parentMenuName} {open ? "▾" : "▸"}
        </div>
        {/* open이 true일 때만 div를 렌더링하고, 클래스명에 active를 추가합니다 */}
        {open && (
          <div className={`sidebar-list ${open ? "active" : ""}`}>
            {level2Menus.map(menu => (
              <div
                key={menu.menuId}
                className={`sidebar-item ${activeLevel2?.menuId === menu.menuId ? "active" : ""}`}
                onClick={() => sideMeneClick(menu)}
                style={{ cursor: 'pointer' }}
              >
                📄 {menu.menuName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
