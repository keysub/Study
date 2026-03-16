interface Menu {
  menuId: string;
  menuName: string;
}

interface Props {
  menus: Menu[];
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

function Header({ menus, activeMenu, setActiveMenu }: Props) {

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
          {menus.map(menu => (
            <div
              key={menu.menuId}
              className={`menu-item ${
                activeMenu === menu.menuId ? "active" : ""
              }`}
              onClick={() => setActiveMenu(menu.menuId)}
            >
              {menu.menuName}
            </div>
          ))}
        </div>
      </div>

      <div className="header-right">
        <span className="user-icon">👤</span>
        <span className="user-name">Developer</span>
      </div>

    </div>
  );
}

export default Header;