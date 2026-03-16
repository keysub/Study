<script setup lang="ts">
//script setup은 Vue 3에서 Composition API를 더 쉽고 간결하게 사용하기 위해 도입된 컴포넌트 Syntactic Sugar
//타입스크립트 활성화: 해당 컴포넌트 파일(.vue) 내의 <script> 블록에서 자바스크립트 대신 타입스크립트 문법을 사용할 수 있게 됩니다.
/*
1. 기존 방식 (Options API)
데이터는 data에, 함수는 methods에 따로 나눠서 작성하며 this를 사용해야 합니다. 
vue
<///script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
<////script>

<///template>
  <button @click="increment">수치: {{ count }}</button>
<///template>
------------------------------------------------------------------
2. 최신 방식 (Composition API + TypeScript)
<script setup lang="ts">를 사용하면 코드가 훨씬 간결해집니다. 1.3.10
vue
<script setup lang="ts">
import { ref } from 'vue'

// 1. 반응형 데이터 선언 (ref 사용)
// lang="ts" 덕분에 count가 number 타입임을 자동으로 추론합니다.
const count = ref<number>(0)

// 2. 함수 정의 (this가 필요 없음)
const increment = (): void => {
  count.value++ // ref 데이터를 수정할 땐 .value를 붙입니다.
}
<///script>

<///template>
  <!-- 템플릿에서는 .value 없이 변수명만 써도 됩니다. -->
  <button @click="increment">수치: {{ count }}</button>
<///template>
*/

//Vue 3 Composition API의 핵심 함수
/*
1. 반응형 상태 관리 (ref, reactive)
데이터가 변할 때 화면이 자동으로 업데이트되게 만듭니다.
ref: 단일 값(숫자, 문자열, 불리언)이나 객체를 다룰 때 사용합니다. 스크립트에서는 .value로 접근해야 하지만, 템플릿에서는 생략 가능합니다
reactive: 객체나 배열 같은 참조 타입 전용입니다. .value 없이 직접 속성에 접근할 수 있지만, 구조 분해 할당 시 반응성을 잃어버릴 수 있어 주의가 필요합니다.

2. 파생 데이터 및 감시 (computed, watch)
computed: 기존 데이터를 기반으로 계산된 값을 만듭니다. 의존하는 데이터가 변하지 않으면 다시 계산하지 않고 캐싱된 값을 반환해 성능에 유리합니다.
watch: 특정 데이터가 변경될 때마다 **특정 로직(사이드 이펙트)**을 실행합니다. API 호출이나 데이터 변경에 따른 추가 작업이 필요할 때 적합합니다.

3. 라이프사이클 및 DOM 제어 (onMounted, nextTick)
onMounted: 컴포넌트가 화면에 렌더링(마운트)된 직후 실행됩니다. DOM 요소에 접근하거나 초기 데이터를 불러올 때 사용합니다. Vue.js 공식 문서: Lifecycle Hooks
nextTick: 데이터 변경 후 DOM 업데이트가 완료될 때까지 기다려주는 함수입니다. 화면이 바뀐 직후의 DOM 상태를 확인해야 할 때 유용합니다. Vue.js 공식 문서: nextTick
*/

import { ref, reactive, onMounted, watch, nextTick, computed  } from 'vue';


/*
// AG Grid 기본 구조

<script setup lang="ts">
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';

  1. 컬럼 정의
const columnDefs = ref([
  { field: "make", headerName: "제조사" },
  { field: "model", headerName: "모델명" },
  { field: "price", headerName: "가격" }
]);

  2. 로우 데이터
const rowData = ref([
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 }
]);

  3. 기본 컬럼 설정
const defaultColDef = {
  flex: 1,
  sortable: true,
  filter: true,
};
<//script>

<template>
  <!-- AG Grid 컴포넌트 사용 -->
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 400px; width: 600px;"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :defaultColDef="defaultColDef"
  >
  <//ag-grid-vue>
<//template>
*/

import { AgGridVue } from 'ag-grid-vue3';

/*
AG Grid Enterprise나 Community 버전에서 TypeScript를 사용할 때 코드의 안정성을 높여주는 핵심 인터페이스

1. 그리드 초기화 및 제어
GridReadyEvent: 그리드가 로드된 직후 실행되는 @grid-ready 이벤트의 타입입니다.
GridApi: 그리드를 프로그래밍적으로 제어(데이터 필터링, 정렬, 선택 등)하기 위한 API 객체의 타입입니다.
themeQuartz: AG Grid의 최신 Quartz 테마를 적용할 때 사용합니다.

2. 데이터 가공 및 서식 (Column Definition)
컬럼 설정(columnDefs) 내에서 데이터를 어떻게 보여주고 수정할지 정의할 때 사용합니다.
ValueGetterParams: 여러 필드를 합치거나 계산된 값을 보여줄 때 (valueGetter) 사용합니다.
ValueFormatterParams: 화면에 표시되는 텍스트의 포맷(예: 날짜 형식, 천 단위 콤마)을 지정할 때 사용합니다.
ValueSetterParams: 사용자가 셀을 수정했을 때 데이터를 어떻게 저장할지 정의합니다.

3. 이벤트 및 스타일링
CellValueChangedEvent: 셀 값이 바뀌었을 때 발생하는 이벤트 타입으로, DB 저장 로직 등을 연결할 때 유용합니다.
CellClassParams: 특정 조건에 따라 셀의 CSS 클래스를 동적으로 변경할 때 (cellClassRules) 사용합니다.

*/

import { 
  type CellValueChangedEvent, 
  type GridApi, 
  type GridReadyEvent,
  type ValueFormatterParams, 
  type ValueGetterParams, 
  type ValueSetterParams, 
  type CellClassParams , 
  themeQuartz 
} from 'ag-grid-community';



// --- Types ---

//AG Grid 컴포넌트와 ref에 이 타입을 주입하면, 데이터 구조가 틀렸을 때 에러를 잡아줍니다.
/*
// 1. 데이터 구조 정의
interface RowData {
  id: number;
  name: string;
  price: number;
  category: 'Electronics' | 'Food' | 'Books'; // 유니온 타입으로 제한 가능
  updatedAt?: string; // 선택적 필드
}

// 2. ref에 타입 적용
const rowData = ref<RowData[]>([
  { id: 1, name: 'MacBook', price: 2500000, category: 'Electronics' },
  { id: 2, name: 'Apple', price: 1500, category: 'Food' }
]);

// 3. GridApi에도 타입 적용 (매우 유용!)
const gridApi = ref<GridApi<RowData>>();

*/
/* 

참조 : typeScript에서 제공하는 유틸리티 타입(Utility Types)
     자바스크립트 객체사용과 같으나 개발시 규칙을 넣음
 
   1. Partial<RowData> (부분 집합)
     의미: RowData 인터페이스의 모든 속성을 선택 사항(Optional, ?)으로 만듭니다.
     왜 쓰나?: _oldValues에 원본 데이터를 다 담지 않고, 수정된 것만 골라서 백업하거나 일부만 저장하고 싶을 때 유용
   2. Record<string, boolean> (지도/사전 구조)
	 의미: Key의 타입은 string이고, Value의 타입은 boolean인 객체를 정의합니다.
	 왜 쓰나요?: 어떤 필드가 수정되었는지 true/false로 기록하는 체크리스트 역할을 하기 위해서입니다.
	 
   3. 차이점
   Partial<RowData>: RowData 인터페이스에 이미 선언된 이름(activityId 등)만 키로 쓸 수 있습니다.	 
   Record<string, boolean>: 선언되지 않은 새로운 문자열도 키로 마음대로 쓸 수 있습니다
   
   // 전체 설명
   
   1. Partial<T> (전부 선택 사항으로!)
   기능: 모든 속성을 ? (옵셔널)로 바꿉니다.
   언제 쓰나?: 데이터의 일부만 수정(Update)하거나, 임시 저장할 때 씁니다.
   예시: Partial<RowData>는 RowData의 필드가 10개라도 1개만 있어도 통과!
   2. Required<T> (무조건 다 넣어!)
   기능: Partial과 반대입니다. 모든 속성을 필수값으로 바꿉니다.
   언제 쓰나?: 옵셔널 필드가 많은 인터페이스를 가져와서, "이 로직에서는 반드시 모든 값이 다 있어야 해"라고 강제할 때 씁니다.
   3. Pick<T, Keys> (필요한 것만 쏙쏙!)
   기능: 특정 타입에서 원하는 키만 골라서 타입을 만듭니다.
   예시: Pick<RowData, 'activityId' | 'activityName'>
   activityId와 activityName만 가진 새로운 타입이 탄생합니다.
   4. Omit<T, Keys> (필요 없는 것만 빼고!)
   기능: Pick과 반대입니다. 특정 키만 제외하고 나머지를 다 가져옵니다.
   언제 쓰나?: 보통 DB의 id나 createdAt처럼 사용자가 입력하지 않아도 되는 필드만 싹 빼고 싶을 때 씁니다.
   예시: Omit<RowData, 'activityId'> (ID만 빼고 나머지 다!)
   5. Record<Keys, Type> (지도/사전 만들기)
   기능: 앞서 설명해 드린 대로, [키 이름의 타입]과 [값의 타입]을 정해서 객체 구조를 만듭니다.
   예시: Record<string, number> (키는 문자열, 값은 숫자만 들어오는 사전)
*/
interface RowData {
  activityId: string;
  activityDate: string;
  activityName: string;
  outputName: string;
  targetQty: number;
  _rowState?: "NORMAL" | "INSERT" | "UPDATE";
  _oldValues?: Partial<RowData>;
  _editedFields?: Record<string, boolean>;
}

interface SearchParams {
  activityName: string;
  outputName: string;
  startDate: string;
  endDate: string;
}

// --- State ---
/*
 const gridApi : 상수 선언: 참조 자체는 변하지 않음을 의미합니다. 하지만 내부의 value는 바뀔 수 있습니다.
 ref< ... > (반응형 래퍼) : 역할: Vue가 추적하는 반응형 컨테이너입니다. 값이 바뀌면 이 객체를 관찰하던 UI가 자동으로 업데이트됩니다
 // ref가 없는 변수는 자바에서 Getter/Setter가 없는 private 필드와 같습니다. 외부(HTML 템플릿)에서 이 값이 변했는지 알 방법이 없습니다.
 // ref가 없으면 v-model이나 {{ activityName }} 같은 Vue의 핵심 기능을 사용할 수 없게 됩니다
 // <!-- 1. v-model 사용 -->
     <input v-model="activityName" //>
    <!-- 2. 풀어서 쓰기 (자바의 Getter + EventListener 구조) -->
     <input 
       :value="activityName" 
       @input="activityName = $event.target.value" 
     //>
   예시
   <script setup lang="ts"//>
   import { ref } from 'vue';

   const activityName = ref(""); // 자바의 private String activityName = "";
   <//script>

   <template>
     <div>
       <!-- 사용자가 '축구'라고 치면 activityName.value는 즉시 '축구'가 됨 -->
       <input type="text" v-model="activityName" placeholder="활동명 검색" />
       
       <p>실시간 검색어: {{ activityName }}</p>
     </div>
   <//template>
	 
   참조 {{ ... }}
   
   자동 언래핑(Unwrapping): 스크립트에서는 activityName.value라고 써야 하지만, 이 중괄호 안에서는 Vue가 알아서 .value를 꺼내서 보여줍니다. 그냥 변수명만 쓰면 됩니다.
   반응성 연결: 만약 사용자가 v-model로 입력창에 글자를 치면, activityName 값이 바뀌고, 그 결과 {{ activityName }}이 적힌 화면의 글자도 실시간으로 바뀝니다.

   
 GridApi<RowData>: AG Grid의 컨트롤러 타입입니다. 
                  제네릭 <RowData>를 한 번 더 사용하여 "이 API가 다루는 행 데이터의 구조는 RowData 인터페이스를 따른다"는 것을 명시합니다. 
				  (자바의 List<MemberDTO>와 같은 계층적 제네릭)
 (null) (초기값) : 괄호 안의 값은 gridApi.value의 초기값입니다. 처음에는 그리드 객체가 없으므로 null로 시작합니다.

*/
const gridApi = ref<GridApi<RowData> | null>(null);
	
//AG Grid에 뿌려줄 실제 데이터 리스트를 정의하는 부분입니다. 자바 개발자에게 익숙한 **List<RowData>** 를 Vue의 반응형 시스템으로 감싼 형태
const rowData = ref<RowData[]>([]);
	
//boolean 필드를 Vue의 반응형 상태(State)로 선언
const showSearch = ref(true);

// Search Filters
//자바의 String activityName = ""; 필드를 Vue의 반응형 상태(State)로 선언한 것
const activityName = ref("");
const outputName = ref("");
const startDate = ref("");
const endDate = ref("");

// Combo Lists
const activities = ref<[string, string][]>([]); 
const outputs = ref<[string, string][]>([]);
const filterData = ref<[string, string][]>([]);
const deletedRows = ref<RowData[]>([]);

// --- Grid Config ---
//computed라는 Vue의 반응형 계산된 속성을 사용하여 AG Grid의 컬럼 정의(columnDefs)를 선언한 것
//의존하는 필드가 바뀔 때만 다시 계산(Caching)되는 Getter 메서드
// computed(() => [...]) 안에 있는 로직을 실행해서 결과값을 columnDefs.value에 담아라. 그런데 만약 참조하는 변수가 변하면 자동으로 다시 실행해라."
// computed는 계산 로직이 포함된 Getter 라면 ref 는  일반 Field (변수) 라고 생각하면 됨
const columnDefs = computed(() => [
  {
    headerName: 'No',
    valueGetter: "node.rowIndex + 1",
    width: 60,
    minWidth: 60,
    maxWidth: 70,
	filter: false, 
    cellStyle: { textAlign: 'center', color: '#888' },
  },
  {
    headerName: 'Sel',
    width: 60,
    minWidth: 60,
    maxWidth: 70,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: 'left',
    cellStyle: { display: 'flex', textAlign: 'center' },
    headerClass: 'ag-header-cell-center',
  },
  {
    headerName: "액티비티 ID",
    field: "activityId",
    flex: 1,
    cellStyle: { display: 'flex', textAlign: 'center' },
  },
  {
    headerName: "액티비티 명",
    field: "activityName",
    flex: 2.5,
    editable: true,
    // [중요] 배경색 로직 적용
	cellStyle: (params: CellClassParams ) => ({
	  backgroundColor: params.data?._editedFields?.activityName ? "#FFF3BF" : "#FFF9DB"
	})
  },
  {
    headerName: "작업 결과물",
    field: "outputName",
    flex: 2.5,
    editable: true,
    cellStyle: (params: CellClassParams ) => ({
      backgroundColor: params.data?._editedFields?.outputName ? "#FFF3BF" : "#FFF9DB"
    })
  },
  {
      headerName: "WBS 날짜",
      field: "activityDate",
      flex: 1.5,
      editable: true,
      cellEditor: 'agDateCellEditor',

      // 1. 화면 표시 형식 (문자열 반환)
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return params.value;
        return date.toISOString().split('T')[0];
      },

      // 2. 에디터(날짜 선택기)에 전달할 값 (Date 객체 반환)
      valueGetter: (params: ValueGetterParams) => {
        const val = params.data?.activityDate;
        return val ? new Date(val) : null;
      },

      // 3. 저장 시 로직 (데이터 변경 및 플래그 설정)
	  valueSetter: (params: ValueSetterParams) => {
	    const dateObj = params.newValue;
	    
	    // 1. 선택된 값이 유효한 Date 객체인지 확인
	    if (params.data && dateObj instanceof Date && !isNaN(dateObj.getTime())) {
	      // YYYY-MM-DD 형식으로 변환
	      const year = dateObj.getFullYear();
	      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
	      const day = String(dateObj.getDate()).padStart(2, '0');
	      const newDateStr = `${year}-${month}-${day}`;

	      // 2. 값이 실제로 변했을 때만 처리
	      if (params.data.activityDate !== newDateStr) {
	        params.data.activityDate = newDateStr; // 데이터 업데이트
	        
	        // 상태 플래그 설정
	        if (!params.data._editedFields) params.data._editedFields = {};
	        params.data._editedFields.activityDate = true;
	        
	        if (params.data._rowState !== "INSERT") {
	          params.data._rowState = "UPDATE";
	        }
	        
	        return true; // 중요: true를 반환해야 AG Grid가 변경을 확정함
	      }
	    }
	    return false; // 변경 실패 시 false 반환
	  },

      // 4. 에디터 설정
      cellEditorParams: {
        min: '2025-01-01',
        max: '2026-12-31',
      },

      // 5. 조건부 스타일 (배경색)
      cellStyle: (params: CellClassParams) => ({
        textAlign: "center",
        backgroundColor: params.data?._editedFields?.activityDate ? "#FFF3BF" : "#FFF9DB"
      })
    },
  {
    headerName: "목표 수량",
    field: "targetQty",
    flex: 1.5,
    editable: true,
    cellStyle: params => ({
      textAlign: "right",
      backgroundColor: params.data?._editedFields?.targetQty ? "#FFF3BF" : "#FFF9DB"
    })
  },
]);

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
  sortable: true,
  filter: false,
};

// --- Methods ---

const selectCombo = () => {
  fetch("/api/wbsSetup/selectCombo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(r => r.json())
	// any[] : 어떤 타입(any)이든 상관없이 요소로 가질 수 있는 배열
    .then((data: SearchParams[]) => { 
      const filterDataList: [string, string][] = [];
      const act = new Map<string, string>();
      const out = new Map<string, string>();

      data.forEach(d => {
        filterDataList.push([d.activityName, d.outputName]);
        // Map을 사용하여 중복 제거
        act.set(d.activityName, d.activityName);
        out.set(d.outputName, d.outputName);
      });

      // 3. 값 할당 (Vue 3의 ref로 선언된 반응형 변수에 값을 넣을 때 .value를 사용)
      filterData.value = filterDataList;
      activities.value = [...act];
      outputs.value = [...out];
    })
    .catch(err => {
      console.error("Select Data Load Error:", err);
    });
};


const selectList = () => {
  // 1. 전송할 파라미터 구성 (Vue ref이므로 .value 사용)
  const requestBody = { 
    activityName: activityName.value, 
    outputName: outputName.value, 
    startDate: startDate.value, 
    endDate: endDate.value 
  };

  fetch("/api/wbsSetup/selectList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
  .then((res) => {
    if (!res.ok) throw new Error(`서버 에러: ${res.status}`);
    return res.json();
  })
  
  //  (data: RowData[]) => {
  /**
   * 화살표 함수(Arrow Function)의 시작입니다
   * data라는 이름의 파라미터를 받습니다.
   * RowData[]는 data가 RowData라는 타입을 가진 객체들의 배열임을 명시합니다.
   */	
  .then((data: RowData[]) => {
	/*rowData.value = data.map((d) => ({
	* rowData.value: Vue 3의 ref로 선언된 반응형 변수에 값을 넣을 때 .value를 사용합니다.
	* data.map(...): 배열의 내장 메서드로, 기존 배열을 순회하며 새로운 형태의 배열을 만들어 반환합니다.
	* (d) => ({: 각 항목(d)을 순회하며 객체({})를 즉시 반환(Implicit Return)하겠다는 뜻
	* 괄호 ( 가 없으면 함수의 몸체 { 로 인식되기 때문에 객체 반환 시 필수입니다.
	*/	
    rowData.value = data.map((d) => ({
      ...d,
      _editedFields: {},
      _oldValues: { 
        activityDate: d.activityDate, 
        activityName: d.activityName, 
        outputName: d.outputName, 
        targetQty: d.targetQty 
      },
      _rowState: "NORMAL", // Vue에서는 'as const' 없이 문자열로 할당 가능 (인터페이스 타입에 따라 조절)
    }));
  })
  .catch((err) => {
    console.error("Grid Load Error:", err);
  });
};

const handleReset = () => {
  activityName.value = "";
  outputName.value = "";
  startDate.value = "";
  endDate.value = "";
  selectList();
};

const handleAdd = () => {
  const newRow: RowData = {
    activityId: "",
    activityDate: "",
    activityName: "",
    outputName: "",
    targetQty: 0,
    _rowState: "INSERT",
    _editedFields: {}
  };
  
  // 1. Vue의 반응형 데이터(rowData)에 먼저 추가 (중요!)
  // ...rowData :  rowData.push(newRow) 를 안쓰고 
  // 새로운 배열을 대입(=)하는 방식은 데이터가 아예 교체되었다"고 Vue에게 확실히 신호를 주기 때문에 불변성(Immutability)을 지키는 코딩 패턴에서 선호된다고함
  //
  rowData.value = [...rowData.value, newRow];
  
  // 2. 그 다음 AG Grid API를 통해 화면에 반영하고 포커스 처리
  // (rowData.value를 통째로 바꾸면 그리드가 리렌더링되므로, 
  //  안전하게 순차적으로 처리하거나 혹은 데이터 바인딩 방식에 맞춰 수정이 필요합니다.)

  setTimeout(() => {
    if (gridApi.value) {
      const lastIndex = rowData.value.length - 1;
      
	  //스크롤이동
      gridApi.value.ensureIndexVisible(lastIndex);
	  //포커스 이동
      gridApi.value.setFocusedCell(lastIndex, 'activityName');
	  //편집 모드(입력창)를 즉시 활성화
      gridApi.value.startEditingCell({ rowIndex: lastIndex, colKey: 'activityName' });
    }
  }, 50);
};

const handleDelete = () => {
  if (!gridApi.value) return;
  
  //현재 선택 상태인 행들의 '노드(Node) 객체'들을 배열로 반환
  //노드(Node)란?: 단순한 데이터(data)뿐만 아니라, 그 행이 몇 번째인지(rowIndex), 선택되었는지(selected) 등의 상태 정보까지 포함된 AG-Grid 전용 객체
  const selectedNodes = gridApi.value.getSelectedNodes();
  
  /*
  실제 데이터(data)만 쏙 뽑아내고, 빈 값(null/undefined)을 걸러냄
  /**
   * .map(n => n.data): selectedNodes는 그리드 정보가 담긴 '노드' 뭉치입니다. 여기서 우리가 필요한 순수 데이터 객체(d.data)만 추출해서 새로운 배열을 만듭니다.
   * .filter(...): 추출된 데이터 중 혹시나 있을지 모를 null이나 undefined를 제거하여 안전한 배열을 만듭니다.
   * (d): d is RowData => !!d: 타입 가드(Type Guard)라는 고급 TypeScript 문법입니다.
   * !!d: 데이터가 존재하면 true, 없으면 false로 취급합니다.
   * d is RowData: 이 필터를 통과한 데이터(d)는 확실히 RowData 타입이라고 컴파일러에게 확신을 줍니다.
  */
  const selectedData = selectedNodes.map(n => n.data).filter((d): d is RowData => !!d);

  if (selectedData.length === 0) return alert("삭제할 행을 선택하세요.");

  selectedData.forEach(r => {
    if (r._rowState !== "INSERT") deletedRows.value.push(r);
  });

  rowData.value = rowData.value.filter(r => !selectedData.includes(r));
};

/*
1. 문법 분석
const onCellValueChanged: 함수 이름을 정의합니다. AG-Grid에서 관습적으로 사용하는 이벤트 이름입니다.
e: 이벤트 객체(Event)입니다. 누가, 어떤 줄의, 어떤 칸을, 원래 뭐였는데, 무엇으로 바꿨는지에 대한 모든 정보가 이 e 안에 담겨 있습니다.
: CellValueChangedEvent<RowData>: TypeScript 문법입니다.
e가 단순한 객체가 아니라, **"셀 값이 변경된 이벤트"**라는 구체적인 타입임을 명시합니다.
<RowData>는 이 그리드가 다루는 데이터가 우리가 만든 RowData 규격임을 알려주어, e.data.activityName 같은 자동 완성을 가능하게 합니다.
2. e 객체에서 자주 쓰는 정보들
함수 내부에서 보통 이런 값들을 꺼내 씁니다:
e.data: 수정된 행 전체 데이터 (바뀐 후의 값 포함)
e.oldValue: 수정하기 전의 원래 값
e.newValue: 사용자가 새로 입력한 값
e.column.getColId(): 어떤 컬럼(열)이 수정되었는지 ID 확인

*/

const onCellValueChanged = (e: CellValueChangedEvent<RowData>) => {
  const row = e.data;
  if (!row) return;

  /*
  e.colDef.field: 그리드 설정(columnDefs)에서 정의했던 필드명(예: 'activityName', 'targetQty')을 가져옵니다.
  as (Type Assertion): 타입스크립트에게 **"이 문자열은 그냥 아무 글자가 아니라, RowData 안에 있는 키(Key) 중 하나가 확실해!"**라고 강하게 말하는 것입니다.
  */
  const field = e.colDef.field as keyof RowData;
  const oldValue = e.oldValue;
  const newValue = e.newValue;

  // 1. 값이 변하지 않았다면 아무것도 하지 않음
  if (oldValue === newValue) return;

  // 2. 편집된 필드 기록 객체가 없다면 초기화
  if (!row._editedFields) row._editedFields = {};
  row._editedFields[field as string] = true;

  // 3. 행 상태 변경 (INSERT 상태가 아닐 때만 UPDATE로 변경)
  if (row._rowState !== "INSERT") {
    row._rowState = "UPDATE";
  }

  // 4. AG Grid 화면 강제 갱신 (스타일이나 아이콘 변경 반영용)
  e.api.refreshCells({ rowNodes: [e.node], force: true });
};

const handleSave = async () => {
  if (!gridApi.value) return;
  gridApi.value.stopEditing(false);
  
  //await new Promise(resolve => setTimeout(resolve, 0));
  //데이터를 바꾼 후, Vue가 화면(DOM)을 실제로 다 그릴 때까지 기다려라"라고 명령하는 함수
  await nextTick();
  
  const insertList = rowData.value.filter(r => r._rowState === "INSERT");
  const updateList = rowData.value.filter(r => r._rowState === "UPDATE");
  const deleteList = deletedRows.value;

  if (insertList.length + updateList.length + deleteList.length === 0) {
    return alert("변경 사항이 없습니다.");
  }

  fetch("/api/wbsSetup/saveList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ insertList, updateList, deleteList })
  }).then(r => {
    if (r.ok) {
      alert("저장 완료");
      deletedRows.value = [];
      selectList();
    } else {
      alert("저장 실패");
    }
  });
};


const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
};

// --- Watchers ---
//이 코드는 **"활동명(activityName) 변수가 바뀔 때마다 감시(Watch)하고 있다가, 값이 변하는 순간 특정 동작을 실행해라"**라는 뜻의 Vue 3 반응형 감시자
watch(activityName, (newVal) => {
  if (newVal === "") outputName.value = "";
  
  const filteredOutMap = new Map<string, string>();
  //([act, out]) 부분은 자바스크립트의 구조 분해 할당(Destructuring) 문법
  /*
  filterData.value: Vue의 ref로 선언된 배열 데이터에 접근합니다.
  .forEach(...): 배열의 모든 요소를 순회하며 함수를 실행합니다.
  ([act, out]) => {:
  배열의 각 항목이 또 다른 배열(예: ['코딩', '결과물.zip']) 형태일 때 사용합니다.
  첫 번째 값을 act라는 변수에, 두 번째 값을 out이라는 변수에 즉시 대입해서 함수 안에서 바로 쓸 수 있게 해줍니다.
  */
  filterData.value.forEach(([act, out]) => {
    if (newVal === "" || act === newVal) {
      if (out) filteredOutMap.set(out, out);
    }
  });
  outputs.value = [...filteredOutMap.entries()];
});

onMounted(() => {
  selectCombo(); // 콤보 데이터 로드 호출
  selectList();    // 초기 그리드 데이터 로드
});

</script>

<template>
  <div class="page-wrap">
    <div class="page-header">
      <h1 class="page-title">
        <span style="margin-right: 12px">📋</span>WBS Setup
      </h1>
    </div>

    <!-- Search Box -->
    <div v-if="showSearch" class="search-box-container">
      <div class="search-box card-shadow">
        <div class="search-row">
          <div class="search-item">
            <label>액티비티</label>
            <select v-model="activityName">
              <option value="">전체</option>
              <option v-for="[id, name] in activities" :key="id" :value="id">{{ name }}</option>
            </select>
          </div>
          <div class="search-item">
            <label>작업결과물</label>
            <select v-model="outputName">
              <option value="">전체</option>
              <option v-for="[id, name] in outputs" :key="id" :value="id">{{ name }}</option>
            </select>
          </div>
          <div class="search-item">
            <label>WBS 날짜</label>
            <input type="date" v-model="startDate" :max="endDate" />
            <span class="date-separator">~</span>
            <input type="date" v-model="endDate" :min="startDate" />
          </div>
        </div>
        <div class="search-bottom-bar">
          <div class="search-actions">
            <button @click="handleReset" class="btn reset">Reset</button>
            <button @click="selectList()" class="btn search primary">Search</button>
          </div>
        </div>
      </div>
      <div class="toggle-btn-wrap">
        <div class="toggle-btn flat" @click="showSearch = false">▲ 검색조건 접기</div>
      </div>
    </div>

    <div v-else class="toggle-btn only-toggle" @click="showSearch = true">▼ 검색조건 펼치기</div>

    <!-- Grid Toolbar -->
    <div class="grid-toolbar">
      <div class="left">
        <button @click="handleAdd" class="btn add action">Add</button>
        <button @click="handleDelete" class="btn delete action">Delete</button>
      </div>
      <div class="right">
        <button @click="handleSave" class="btn save success">Save</button>
      </div>
    </div>

    <!-- AG Grid -->
    <div class="grid-wrap">
      <ag-grid-vue
        class="ag-theme-quartz"
        style="height: 500px; width: 100%;"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowHeight="32"
        :headerHeight="38"
        :rowSelection="{ mode: 'multiRow', 
			          checkboxes: false,
			          headerCheckbox: false}"
        :theme="themeQuartz"
        @grid-ready="onGridReady"
        @cell-value-changed="onCellValueChanged"
      />
    </div>
  </div>
</template>
