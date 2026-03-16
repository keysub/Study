/* 참고  화살표 함수
1. 기본 선언과 호출
옛날 방식 : function add(a, b) { ... }  : 함수 자체가 하나의 '독립된 개체' 느낌
요즘 방식 : const add = (a, b) => { ... } :변수에 함수를 '담는' 느낌

2. 매개변수와 리턴
옛날 방식 :
function(a, b) {
  return a + b;
}
요즘: (a, b) => a + b (중괄호 {}를 안 쓰면 자동으로 그 결과를 뱉습니다.)

3. 가장 중요한 차이: this
옛날 방식 (function): "나를 호출한 놈이 내 주인이다." (호출되는 상황에 따라 this가 계속 바뀜)
요즘 방식 (=>): "나를 만든 곳의 주인님이 내 주인이다." (태어날 때 부모의 this를 그대로 물려받고 절대 안 바뀜)

4. map() 함수와 함께 사용 : 배열의 모든 요소를 하나씩 꺼내서 내가 원하는 대로 요리한 뒤, 새로운 배열을 만듭니다.
옛날 방식 (for문):
const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double.push(numbers[i] * 2);
}
요즘: (map + 화살표 함수):
const numbers = [1, 2, 3];
const double = numbers.map(num => num * 2); // [2, 4, 6]
* 리액트 활용: 데이터 배열을 화면에 그릴 때(JSX) 필수입니다. items.map(item => <li>{item}</li>)

5 filter() :조건에 맞는 요소만 골라내서 새로운 배열을 만듭니다. 조건이 true인 것만 살아남아요.
옛날 방식 (for문):
javascript
const ages = [15, 25, 10, 30];
const adults = [];
for (let i = 0; i < ages.length; i++) {
  if (ages[i] >= 20) adults.push(ages[i]);
}

요즘: (filter + 화살표 함수)
const ages = [15, 25, 10, 30];
const adults = ages.filter(age => age >= 20); // [25, 30]

6. find()
const users = [{id: 1, name: 'Kim'}, {id: 2, name: 'Lee'}];
const user = users.find(u => u.id === 2); // {id: 2, name: 'Lee'}

결론 : 리액트에서는 원본 데이터를 직접 수정(numbers.push(4))하면 화면이 안 바뀔 수 있어요. 
그래서 항상 새로운 배열을 만들어주는 고차 함수(map, filter, concat 등)를 쓰는 것이 기본 중의 기본입니다.

추가 : 구조 분해 할당(Destructuring Assignment)은 이름 그대로 객체나 배열의 구조를 '분해'해서 그 안에 있는 값들을 개별 변수에 '할당'
      리액트에서 props를 받거나 useState를 쓸 때 매일 사용하는 아주 중요한 개념
	  
1. 객체 구조 분해 : 객체의 키(Key) 이름을 그대로 변수명으로 가져옵
옛날 방식: 일일이 점(.)을 찍어서 접근
const user = { name: "김철수", age: 25 };
const name = user.name;
const age = user.age;

요즘 방식 (구조 분해) : 
const { name, age } = { name: "김철수", age: 25 };
console.log(name); // "김철수"

2. 배열 구조 분해 : 배열은 키가 없으므로 순서(인덱스)에 따라 변수 이름을 마음대로 지어서 가져옵니다.

옛날 방식:
const colors = ["red", "blue"];
const first = colors[0];
const second = colors[1];

요즘 방식 (구조 분해):
const [first, second] = ["red", "blue"];
console.log(first); // "red"

리액트 활용: const [count, setCount] = useState(0);이 바로 이 배열 구조 분해 문법

리액트 예시
1. Props 받기
// 옛날 방식
function Welcome(props) {
  return <h1>안녕, {props.name}님! 당신은 {props.role}입니다.</h1>;
}

// 요즘 방식 (함수 파라미터에서 바로 분해)
function Welcome({ name, role = "일반회원" }) {
  return <h1>안녕, {name}님! 당신은 {role}입니다.</h1>;
}
*/

//React  핵심 훅(Hooks)
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

// AG Grid 라이브러리 ag-grid-community와 ag-grid-react의 버전은 항상 동일하게 유지
import { AgGridReact } from "ag-grid-react";
//AG Grid v31.x 버전 이상의 모듈형 방식
import {
		RenderApiModule ,
        DateEditorModule, 
		ClientSideRowModelModule,
        ValidationModule,   // 데이터 편집 시 유효성 검사 로직을 활성화할 때 필요.
        CellStyleModule,
        TextEditorModule,
        NumberEditorModule,
		ScrollApiModule,    //특정 행으로 스크롤하거나
		RowApiModule,       // 행 위치를 계산하는 복잡한 API 기능을 사용 ex : gridRef.current.api.getRowNode(id)
		RowSelectionModule, // <--- 체크박스 선택 기능을 위해 함께 추가 권장
		ModuleRegistry, 
		PaginationModule,
		themeQuartz        // 테마 객체 : AgGridReact의 theme props에 직접 전달하여 사용
} from "ag-grid-community";

import type { GridApi, ColDef, CellValueChangedEvent } from "ag-grid-community";

// 1. 모듈 등록 (컴포넌트 외부에서 한 번만 실행) (themeQuartz는 모듈이 아니므로 여기서 제외)
ModuleRegistry.registerModules([
  ScrollApiModule,
  RenderApiModule ,
  DateEditorModule, 
  ClientSideRowModelModule,
  RowApiModule,
  RowSelectionModule,
  ValidationModule,
  CellStyleModule,
  TextEditorModule,
  NumberEditorModule,
  PaginationModule,
]);


interface SearchParams {
  activityName?: string;
  outputName?: string;
  startDate?: string;
  endDate?: string;
}

interface SelectBoxData {
  activityName: string;
  outputName: string;
}

interface RowData {
  performanceId: string;
  activityId: string;
  activityDate: string;
  activityName: string;
  outputName: string;
  targetQty: number;
  actualDate: string;
  actualQty: number;
  activityStatus: string;
  // |는 유니온 타입(Union Type)을 정의하는 구분자 , 
  // 이 변수는 A 또는 B 또는 C 중 하나의 값만 가질 수 있다"는 뜻의 'OR(또는)' 연산자 역할
  _rowState: "NORMAL" |"UPDATE";
  // Record<string, boolean> : TypeScript에서 **"키(Key)는 문자열(string)이고, 값(Value)은 불리언(boolean)인 객체"**를 정의하는 타입 도구
  // ?가 붙은 것은 이 필드가 **옵션(Optional)**임을 뜻하며, 데이터가 없을 수도 있다는 의미
  //  부분 업데이트(Partial Update): 서버에 데이터를 저장할 때, 행 전체를 보내는 대신 _editedFields에 true로 체크된 컬럼만 골라서 보낼 수 있어 네트워크 비용을 아낍니다.
  //  시각적 피드백: 그리드의 cellStyle 설정에서 params.data._editedFields?.[params.colDef.field]가 true인 셀에만 노란색 배경을 칠해주는 식으로 "수정된 셀 강조" 기능을 쉽게 구현합니다.
  //  유연성: Record<string, boolean>은 키 이름을 미리 정해두지 않기 때문에, 나중에 새로운 컬럼(activityDate 등)이 추가되어도 코드를 수정할 필요 없이 바로 대응이 가능합니다.
  _editedFields?: Record<string, boolean>;
  _oldValues?: {
	actualDate: string;
	actualQty: number;
  };
}

function WbsExecution() {
  // useRef (보관함) : React에서 컴포넌트가 리렌더링되어도 값이 초기화되지 않고 유지되는 저장 공간
  const gridApiRef = useRef<GridApi<RowData> | null>(null);
  
  const [filterData, setFilterData] = useState<[string, string][]>([]); 
  const [activities, setActivities] = useState<[string, string][]>([]);
  const [outputs, setOutputs] = useState<[string, string][]>([]);
  
  const [activityName, setActivityName] = useState("");
  const [outputName, setOutputName] = useState("");

  const [showSearch, setShowSearch] = useState(true);
  const [rowData, setRowData] = useState<RowData[]>([]);

  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
  
  /*
  useMemo, useRef 차이점과 공통점 
  리렌더링이 발생해도 값을 유지한다는 공통점
  useMemo: 복잡한 계산 결과(값)를 재사용하여 성능을 높일 때 (성능 최적화용)
  useRef: 값이 변해도 화면을 다시 그리지 않고 데이터만 저장하거나 DOM에 접근할 때 (저장소/리모컨용)
  */
  //기본 컬럼 정의
  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    flex: 1,
    minWidth: 100
  }), []);
  
  /* =========================
     Columns
     ========================= */
	 //AgGridReact 속성 columnDefs 정의
	 //ColDef<RowData>[] : TypeScript 타입 지정 
	 //ColDef: AG Grid가 제공하는 타입으로, 컬럼 설정에 쓸 수 있는 속성(예: field, headerName, editable 등)만 사용하도록 제한.
	 const columnDefs: ColDef<RowData>[] = useMemo(() => [
	   {
		  headerName: "키", 
		  field: "performanceId",  
		  hide: true,               // 화면에서 숨김 처리
		  suppressColumnsToolPanel: true, // 사용자가 우측 패널에서 다시 켜는 것을 방지
	   },
	   {
	     headerName: 'No',
	     valueGetter: "node.rowIndex + 1",
	     width: 60,
	     minWidth: 60,   // 최소 너비 제한을 풀어줌 (중요!)
	     maxWidth: 70,   // 너무 커지는 걸 방지하려면 추가
	     pinned: 'left',
	     cellStyle: () => ({ textAlign: 'center', color: '#888' }), 
	   }, 
	   { 
	     headerName: "액티비티 ID", 
	     field: "activityId",
	     flex: 1, // 약 10%
		 editable:false,
	     cellStyle: () => ({ display: 'flex', justifyContent: 'center' }),
	   }, 
	   { 
	     headerName: "액티비티 명", 
	     field: "activityName",
	     flex: 2, // 약 25% (가장 넓게)
	     editable: false,
	     cellStyle: () => ({ display: 'flex', justifyContent: 'left' }),
	   }, 
	   { 
	     headerName: "작업 결과물", 
	     field: "outputName",
	     flex: 2.5, // 약 25%
	     editable: false,
	     cellStyle: () => ({ display: 'flex', justifyContent: 'left' }),
	   }, 
	   { 
	     headerName: "WBS 날짜", 
	     field: "activityDate", 
	     flex: 1.5,
	     editable: false,
	     cellEditor: 'agDateCellEditor',
	     cellStyle: () => ({ display: 'flex', justifyContent: 'center' }),
	   },
	   {
	     headerName: "목표 수량",
	     field: "targetQty",
	     flex: 1.5, // 약 15%
	     editable: false,
	     cellStyle: () => ({ display: 'flex', justifyContent: 'right' }),
	   }, 
	   { 
	     headerName: "실적 날짜", 
	     field: "actualDate", 
	     flex: 1.5,
	     editable: true,
	     cellEditor: 'agDateCellEditor',
	     
	     // [수정] 화면에 보여질 때: 데이터가 Date 객체든 문자열이든 YYYY-MM-DD 형식으로 표시
	     valueFormatter: params => {
	       if (!params.value) return '';
	       const date = new Date(params.value);
	       if (isNaN(date.getTime())) return params.value; // 변환 실패 시 원본 표시
	       const year = date.getFullYear();
	       const month = String(date.getMonth() + 1).padStart(2, '0');
	       const day = String(date.getDate()).padStart(2, '0');
	       return `${year}-${month}-${day}`;
	     },

	     valueGetter: params => {
	       const val = params.data?.actualDate;
	       return val ? new Date(val) : null;
	     },

	     // 저장할 때는 다시 'YYYY-MM-DD' 문자열로 변환하여 data에 저장
	     valueSetter: params => {
	   	const dateObj = params.newValue;
	   	if (params.data && dateObj instanceof Date && !isNaN(dateObj.getTime())) { // params.data 체크 추가
	   	  const year = dateObj.getFullYear();
	   	  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
	   	  const day = String(dateObj.getDate()).padStart(2, '0');
	   	  const newDateStr = `${year}-${month}-${day}`;

	   	  if (params.data.actualDate !== newDateStr) {
	   	    params.data.actualDate = newDateStr;
	   	    
	   	    if (!params.data._editedFields) params.data._editedFields = {};
	   	    params.data._editedFields.actualDate = true;
	   	    params.data._rowState = "UPDATE";
	   	    return true;
	   	  }
	   	}
	   	return false;
	     },

	     cellEditorParams: {
	       min: '2025-01-01',
	       max: '2026-12-31',
	     },
	     cellStyle: p => ({
	       textAlign: "center",
	       backgroundColor: p.data?._editedFields?.actualDate ? "#FFF3BF" : "#FFF9DB"
	     })
	   },
	    {
	      headerName: "실적 수량",
	      field: "actualQty",
	      flex: 1.5, // 약 15%
	      editable: true,
	      cellStyle: p => ({
	        textAlign: "right",
	        backgroundColor: p.data?._editedFields?.actualQty ? "#FFF3BF" : "#FFF9DB"
	      })
	    }, 
		 { 
		   headerName: "상태", 
		   field: "activityStatus",
		   hide: true,
		   flex: 1, // 약 10%
		   cellStyle: () => ({ display: 'flex', justifyContent: 'center' }),
		 }, 
], []);


  /* =========================
     Data Load
     ========================= */

  const selectCombo = () => {
      fetch("/api/wbsExecution/selectCombo", {
        method: "POST", // POST 방식 지정
        headers: {
          "Content-Type": "application/json", // JSON 데이터 전송 시 필수
        },
        // 전송할 데이터가 있다면 JSON.stringify({ key: value }) 형태로 추가
      })
        .then(r => r.json())
        .then((data: SelectBoxData[]) => {
		  const filterDataList: [string, string][] = []; 
          const act = new Map<string, string>();
          const out = new Map<string, string>();
          data.forEach(d => {
			filterDataList.push([d.activityName, d.outputName]);
            act.set(d.activityName, d.activityName);
            out.set(d.outputName, d.outputName);
          });
		  
		  setFilterData(filterDataList);
		  /*
		  act: Map { "설계" => "설계", "구현" => "구현" } (특수한 객체 형태)
		  ...act: "설계", "설계", "구현", "구현" (내용물만 쏙 뽑아서 나열)
		  [...act]: [ ["설계", "설계"], ["구현", "구현"] ] (나열된 내용물을 다시 새로운 배열 담기)
		  */
          setActivities([...act]);
          setOutputs([...out]);
        })
		//.catch(): 앞선 .then() 단계들(네트워크 연결, JSON 변환, 데이터 가공) 중 어느 하나라도 에러가 발생할 경우
        .catch(err => console.error("Select Data Load Error:", err));
    };

	//? (Optional Parameter): 이 함수를 호출할 때 인자를 전달하지 않아도 오류가 나지 않음
	//  any: 어떤 타입의 데이터(객체, 문자열, 숫자 등)든 다 받아들임
	//  SearchParams : 정의한 인터페이스 
	const loadGrid = (params?: SearchParams) => {
	  // 전송할 파라미터 객체 const requestBody =  { activityName, outputName, startDate, endDate } 
	  // 옛날방식으로는 var requestBody = { activityName: activityName, outputName: outputName,  startDate: startDate, endDate: endDate };
	  const requestBody = params ? params : { activityName, outputName, startDate, endDate };
		  
	  fetch("/api/wbsExecution/selectList", {
	    method: "POST",
	    headers: {"Content-Type": "application/json"},
	    body: JSON.stringify(requestBody), // 데이터를 JSON 문자열로 변환하여 전송
	  })
	    .then((r) => r.json())
	    .then((data: RowData[]) => {
		  // .map((d) => ({ ... })): 배열의 모든 요소를 순회하며 새로운 형태의 객체로 변환
		  // 람다식에서 **소괄호 ()로 감싼 중괄호 {}**는 "객체를 즉시 반환(Return)하겠다"는 뜻
	      const initializedData = data.map((d) => ({
			//...d (Spread): 기존 데이터(d)의 모든 속성을 그대로 복사해 옴.
			// {...d}는 얕은 복사를 수행함. 만약 d 안에 또 다른 객체나 배열이 들어있다면 그 참조값까지 복사되므로 원본이 같이 바뀔 위험이 있슴
			/* 옛날 스크립트 방식 
			    activityId: d.activityId,
			    activityName: d.activityName,
			    // ... 모든 필드를 일일이 나열해야 함
			*/
	        ...d,
	        _editedFields: {},
	        _oldValues: { actualDate: d.actualDate,  actualQty: d.actualQty},
	        _rowState: "NORMAL" as const,
	      }));
	      setRowData(initializedData);
	    })
	    .catch((err) => console.error("Grid Load Error:", err));
	};
	
	const handleReset = () => {
	  setActivityName(""); 
	  setOutputName("");
	  setStartDate(""); 
	  setEndDate("");
	  loadGrid( {activityName: "",  outputName: "", startDate: "", endDate: ""});
	}
	
	useEffect(() => {
	 selectCombo();
	}, []);
	 
	useEffect(() => {
	  loadGrid();
	}, []);

	useEffect(() => {
	  // 데이터가 없으면 중단
	  if (filterData.length === 0) return;

	  const filteredOutMap = new Map<string, string>();
	  
	  // 1. 액티비티가 '전체'("")인 경우 처리
	  if (activityName === "") {
	    setOutputName(""); // 작업결과물도 '전체'("")로 선택 변경
	  }

	  // filterData를 순회하며 조건에 맞는 결과물만 추출
	  // filterData.forEach(([act, out]) => { ... }): 배열 구조 분해 할당(Destructuring): [act, out] 처럼 배열 내부의 요소를 바로 변수로 꺼내 쓰는 현대적 문법
	  filterData.forEach(([act, out]) => {
	    // 1. activityName이 '전체'("")거나 현재 행의 액티비티와 일치할 때
	    if (activityName === "" || act === activityName) {
			// filteredOutMap.set(out, out) , Map 객체의 특징인 **"키(Key)의 유일성"**을 이용
			// 똑같은 결과물 이름이 100번 들어와도, Map은 기존에 있던 것을 덮어쓰기 때문에 결과적으로 중복 없는 목록 하나만 남게 됨
	      if (out) filteredOutMap.set(out, out); // 중복 제거하며 Map에 담기
	    }
	  });

	  // 2. 필터링된 결과물로 셀렉트박스 업데이트
	  setOutputs([...filteredOutMap]);
	  
	}, [activityName, filterData]);
  /* =========================
     Grid Events
     ========================= */
  //useCallback은 **함수 자체를 메모리에 저장(Memoization)**하여, 컴포넌트가 리렌더링될 때마다 함수가 새로 생성되는 것을 방지하는 Hook
  // useCallback( (params) => { ... }, [의존성] ), 
  // 첫 번째 인자: 실제 실행될 람다식(화살표 함수), 
  // 두 번째 인자 ([]): 이 배열 안의 값이 바뀔 때만 함수를 새로 만듭니다. 비어있다면 컴포넌트 생명주기 동안 딱 한 번만 생성됨
  const onCellValueChanged = useCallback(
	//파라메터 e , 타입은 CellValueChangedEvent , <RowData> : 이 이벤트는 RowData 형식을 가진 데이터를 다룬다
    (e: CellValueChangedEvent<RowData>) => {
		/*  e 에 들어있는 값
		    e.data: 수정된 행(Row) 전체 데이터 (RowData 형식)
		    e.newValue: 사용자가 방금 입력한 새 값
		    e.oldValue: 수정하기 전의 이전 값
		    e.colDef: 수정된 컬럼(열)의 설정 정보 (필드명 등)
		    e.node: 행의 상태(선택 여부 등)를 제어하는 AG Grid 노드 객체
		*/
	  //keyof : 특정 객체(인터페이스)의 키(Key)들만 뽑아내는 연산자 , 타입스크립트(TypeScript) 고유의 문법
	  /*
		  interface RowData {
		    id: number;
		    userName: string;
		    age: number;
		  }
		  // keyof RowData는 "id" | "userName" | "age" 라는 타입이 됨
	  
	  */
      const field = e.colDef.field as keyof RowData;
      const row = e.data;
      if (!row || !row._oldValues) return;

      if (!row._editedFields) row._editedFields = {};
      
	  //e.oldValue, e.newValue 사용하지 않는 이유는 여러 번 값을 바꿨더라도 "최초의 오리지널 값"과 비교하려고 
	  //e.oldValue, e.newValue 바로 직접 변경값이 있어 여러번 바꿀경우 처음 값을 알지 못함
      const oldValue = row._oldValues[field as keyof typeof row._oldValues];
      const newValue = row[field];

      if (oldValue !== newValue) {
        row._editedFields[field as string] = true;
        row._rowState = "UPDATE";
      }
      
      e.api.refreshCells({ rowNodes: [e.node], force: true });
    },
    []
  );

  /* =========================
     Buttons
     ========================= */
  const handleSave = async () => { // async 추가
      const api = gridApiRef.current;
      if (!api) return;

      // 1. 현재 편집 중인 셀의 상태를 강제로 커밋(확정)
      api.stopEditing(false); // false는 취소가 아닌 '저장'을 의미

      // 2. DataGrid가 내부 row data를 갱신할 수 있도록 아주 짧은 지연(Tick)을 줍니다.
	  // new Promise(...) Promise 객체라서 await 사용가능
      await new Promise(resolve => setTimeout(resolve, 0));

      const updateList: RowData[] = [];

      // 이제 갱신된 n.data를 읽어옵니다.
	  // 모든 행(Row)을 하나씩 순회(Loop)하며 특정 작업을 수행하는 함수
      api.forEachNode(n => {
		  // 1. n.data가 존재하는지 체크 (Type Error 해결)
		  if (n.data && n.data._rowState === "UPDATE") {
		    updateList.push(n.data);
		  }
      });
	  
	  if (updateList.length === 0) {
	    alert("변경 사항이 없습니다.");
	    return;
	  }

	  fetch("/api/wbsExecution/saveList", { // 경로 /api 추가 확인
	    method: "POST",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify({ updateList })
	  }).then(r => {
	    if (r.ok) {
	      alert("저장 완료");
	      loadGrid();
	    } else {
	      alert("저장 실패");
	    }
	  });
  };

  //리액트(React)에서 화면에 보여줄 내용(JSX)을 반환하는 문장의 시작
  return (  
	//<div className="page-wrap">: 전체 페이지를 감싸는 가장 바깥쪽 주머니
	//HTML의 class 대신 리액트에서는 className을 사용
	//{ : 자바스크립트 코드 사용
	/* 사용례 : 패턴 A: 데이터가 있을 때만 그리드 보여주기 
				{rowData ? (
				  <AgGridReact rowData={rowData} ... />
				) : (
				  <p>데이터를 불러오는 중입니다...</p>
				)}
	         패턴 B: 상단 버튼 바 넣기 
				 <div className="button-group">
				   <button onClick={onAddRow}>추가</button>
				   <button onClick={onSave}>저장</button>
				 </div>
	   */
	<div className="page-wrap">
	  {/* 페이지 타이틀: 이모지를 추가하여 시각적 포인트 부여 */}
	  <div className="page-header">
	    <h1 className="page-title">
	      <span style={{ marginRight: '12px' }}>📋</span>WBS Execution
	    </h1>
	  </div>

	  {showSearch && (
	    <div className="search-box-container">
	      <div className="search-box card-shadow">
	        <div className="search-row">
	          <div className="search-item">
	            <label>액티비티</label>
				{/* 1. 액티비티 선택 박스 
					e.target: 현재 글자를 입력 중인 바로 그 <input> 태그 자체를 가리킵
					e.target.value: 그 입력창에 지금 적혀 있는 실제 글자
					e.type : 발생한 이벤트의 종류입니다. 여기서는 "change" 또는 "input"
					e.timeStamp: 이벤트가 발생한 시각 등....
			    */}
				<select value={activityName} onChange={e => setActivityName(e.target.value)}>
				  <option value="">전체</option>
				  {activities.map(([id, name], i) => (
				    // id가 중복될 가능성이 있다면 `${id}-${i}` 처럼 고유하게 만듭니다.
				    <option key={id || i} value={id}>
				      {name}
				    </option>
				  ))}
				</select>
	          </div>
	          <div className="search-item">
	            <label>작업결과물</label>
				{/* 2. 작업결과물 선택 박스 */}
				<select value={outputName} onChange={e => setOutputName(e.target.value)}>
				  <option value="">전체</option>
				  {outputs.map(([id, name], i) => (
				    <option key={id || i} value={id}>
				      {name}
				    </option>
				  ))}
				</select>
	          </div>
			  
			  <div className="search-item">
			    <label>WBS 날짜</label>
			    <input 
			      type="date" 
			      value={startDate} 
			      onChange={e => setStartDate(e.target.value)} 
			      max={endDate} 
			    />
			    <span className="date-separator">~</span>
			    <input 
			      type="date" 
			      value={endDate} 
			      onChange={e => setEndDate(e.target.value)} 
			      min={startDate} 
			    />
			  </div>


	        </div>

	        <div className="search-bottom-bar">
			<div className="search-actions">
			  <button type="button" className="btn reset" onClick={handleReset}>Reset</button>
			  <button type="button" className="btn search primary" onClick={() => loadGrid()}>Search</button>
			</div>
	        </div>
	      </div>

	      <div className="toggle-btn-wrap">
	        <div className="toggle-btn flat" onClick={() => setShowSearch(false)}>
	          ▲ 검색조건 접기
	        </div>
	      </div>
	    </div>
	  )}

	  {!showSearch && (
	    <div className="toggle-btn only-toggle" onClick={() => setShowSearch(true)}>
	      ▼ 검색조건 펼치기
	    </div>
	  )}

	  <div className="grid-toolbar">
	    <div className="left">
		
	    </div>
	    <div className="right">
	      <button className="btn save success" onClick={handleSave}>Save</button>
	    </div>
	  </div>

	  <div className="grid-wrap">
	    <div 
	      className="ag-theme-quartz" 
	      style={{ 
	        height: '500px', 
	        width: '100%',
	        '--ag-header-background-color': '#f8f9fa',
	        '--ag-header-foreground-color': '#333',
	        '--ag-border-color': '#e9ecef',
	        '--ag-font-size': '13px',
	      } as React.CSSProperties} 
	    > 
		<AgGridReact
		  rowData={rowData}
		  columnDefs={columnDefs}
		  //페이징 활성화
		  pagination={true}
		  //한 페이지에 보여줄 행 개수 (기본값은 100)
		  paginationPageSize={20}
		  //(선택) 페이지 크기 선택 목록 추가 (v31 이상 권장)
		  paginationPageSizeSelector={[10, 20, 50, 100]}
		  
		  defaultColDef={defaultColDef}
		  rowHeight={32} 
		  headerHeight={38} 
		  rowSelection={{ 
		    mode: 'multiRow', 
		    checkboxes: false,
		    headerCheckbox: false
		  }}
		  theme={themeQuartz}
		  onGridReady={p => (gridApiRef.current = p.api)}
		  
		  getRowId={params => params.data.performanceId || params.data.activityId} 

		  //셀 값이 바뀔 때마다 해당 행의 스타일을 다시 계산
		  onCellValueChanged={params => {
		    onCellValueChanged(params);
		    params.api.refreshCells({ rowNodes: [params.node], force: true });
		  }}
		/>
	    </div>
	  </div>
	</div>
  );
}

export default WbsExecution;
