import { type Menu } from "../menu";

// App.tsx에서 전달하는 Props와 타입을 일치시킵니다.
interface UserManagementProps {
  level2Menus: Menu[];
  activeLevel2: Menu | null;
  onSelect: (menu: Menu | null) => void;
}

export default function UserManagement({
  level2Menus,
  activeLevel2,
  onSelect: _onSelect, // 변수명 앞에 _ 추가
}: UserManagementProps) {
  const currentMenuName = activeLevel2?.menuName || "User Management";

  return (
    <div className="user-mgmt-page">
      <div className="user-mgmt-card">
        <div className="user-mgmt-icon">👤</div>
        <h1>{currentMenuName}</h1>
        <p className="status-text">현재 개발중입니다</p>
        <p className="sub-text">곧 기능이 추가됩니다</p>
      </div>

      {/* 디자인 일관성을 위해 하단에 메뉴 목록을 표시하거나 로직을 추가할 수 있습니다 */}
      {level2Menus.length > 0 && (
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          관리 가능 메뉴: {level2Menus.map((m) => m.menuName).join(", ")}
        </div>
      )}
    </div>
  );
}
