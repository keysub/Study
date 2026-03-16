// 반드시 export를 붙여야 다른 파일에서 'Menu'를 인식합니다.
//  export를 붙이는 이유는 "이 함수를 이 파일 밖으로 꺼내서, 다른 파일에서도 쓸 수 있게 허락하기 위해서" .
//  리액트 프로젝트는 수십 개의 파일로 나뉘어 있습니다. 
//  자바스크립트는 기본적으로 한 파일 안에 선언된 변수나 함수를 해당 파일 안에서만 쓰도록 격리해 두는데,
//  이 빗장을 푸는 것이 바로 export입니다
//  내보낼 때 (menu.ts): export const fetchTopMenus = ...
//  가져올 때 (App.tsx): import { fetchTopMenus } from "./menu";

export interface Menu {
  menuId: string;
  menuName: string;
  menuUrl: string;
  parentMenuId?: string;
}

//const API_BASE_URL = "http://localhost:8080/menus";
const API_BASE_URL = "/menus"; // ✅ 프록시가 알아서 처리함

// Promise<Menu[]> : 이 함수는 비동기 함수(async)이므로 결과값을 Promise 상자에 담아 반환
// fetch: 브라우저 내장 도구를 사용하여 서버에 데이터를 요청합니다.
// method: "POST"
// headers:JSON 형식
export const fetchTopMenus = async (): Promise<Menu[]> => {
  const response = await fetch(`${API_BASE_URL}/selectTopMenus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("1차 메뉴 로딩 실패");
  return response.json();
};

export const fetchSubMenus = async (parentMenuId: string): Promise<Menu[]> => {
  const response = await fetch(`${API_BASE_URL}/selectSubMenus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parentMenuId: parentMenuId }),
  });
  if (!response.ok) throw new Error("2차 메뉴 로딩 실패");
  return response.json();
};
