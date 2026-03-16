import { type Menu } from "../menu";
import { useNavigate } from "react-router-dom";

// App.tsx의 Dispatch<SetStateAction<Menu | null>>와 호환되도록 null 허용
interface Props {
  level2Menus: Menu[];
  activeLevel2: Menu | null;
  onSelect: (menu: Menu | null) => void; 
}

export default function Dashboard({ level2Menus, activeLevel2, onSelect }: Props) {
  const navigate = useNavigate();

  const handleClick = (menu: Menu) => {
    onSelect(menu); // 메뉴 객체 전달
    if (menu.menuUrl) navigate(menu.menuUrl);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>👋 환영합니다!</h1>
          <p>
            React SPA 학습 프로젝트에 오신 것을 환영합니다.
            <br />
            아래 메뉴를 선택하세요.
          </p>
        </div>
        <div className="hero-image">📚💻</div>
      </div>
      
      <div className="dashboard-cards">
        {/* level2Menus가 존재할 때만 렌더링 */}
        {level2Menus && level2Menus.length > 0 ? (
          level2Menus
            .filter(menu => menu.menuId !== activeLevel2?.menuId)
            .map(menu => (
              <div 
                key={menu.menuId} 
                className="dash-card" 
                onClick={() => handleClick(menu)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-icon">📄</div>
                <div className="card-title">{menu.menuName}</div>
                <div className="card-desc">해당 메뉴로 이동합니다</div>
              </div>
            ))
        ) : (
          <div className="no-menu-msg">활성화된 하위 메뉴가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
