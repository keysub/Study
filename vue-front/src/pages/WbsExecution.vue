<script setup lang="ts">

import { ref, reactive, onMounted, watch, nextTick, computed  } from 'vue';

import { AgGridVue } from 'ag-grid-vue3';

import { 
  type CellValueChangedEvent, 
  type GridApi, 
  type GridReadyEvent,
  type ValueFormatterParams, 
  type ValueGetterParams, 
  type ValueSetterParams, 
  type CellClassParams , 
  type GetRowIdParams,
  themeQuartz 
} from 'ag-grid-community';

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
  _rowState?: "NORMAL" | "UPDATE";
  _oldValues?: {
  　　actualDate: string;
  　　actualQty: number;
  };
  _editedFields?: Record<string, boolean>;
}

interface SearchParams {
  activityName: string;
  outputName: string;
  startDate: string;
  endDate: string;
}

interface SelectBoxData {
  activityName: string;
  outputName: string;
}

const gridApi = ref<GridApi<RowData> | null>(null);
	
const rowData = ref<RowData[]>([]);
	
const showSearch = ref(true);

// Search Filters
const activityName = ref("");
const outputName = ref("");
const startDate = ref("");
const endDate = ref("");

// Combo Lists
const activities = ref<[string, string][]>([]); 
const outputs = ref<[string, string][]>([]);
const filterData = ref<[string, string][]>([]);

const getRowId = (params: GetRowIdParams<RowData>) => {
  // string | number 타입이어야 하므로 값이 확실히 있는지 확인하는 것이 좋습니다.
  return params.data.performanceId || params.data.activityId;
};

const columnDefs = computed(() => [
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
    minWidth: 60,
    maxWidth: 70,
	filter: false, 
    cellStyle: { textAlign: 'center', color: '#888' },
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
    flex: 2,
    cellStyle: { display: 'flex', textAlign: 'center' },
  },
  {
    headerName: "작업 결과물",
    field: "outputName",
    flex: 2.5,
    cellStyle: { display: 'flex', textAlign: 'center' },
  },
  { 
    headerName: "WBS 날짜", 
    field: "activityDate", 
    flex: 1.5,
    cellStyle: { display: 'flex', textAlign: 'center' },
  },
  {
    headerName: "목표 수량",
    field: "targetQty",
    flex: 1.5,
    cellStyle: { display: 'flex', textAlign: 'center' },
  },
  {
      headerName: "실적 날짜",
      field: "actualDate",
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
        const val = params.data?.actualDate;
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
        if (params.data.actualDate !== newDateStr) {
          params.data.actualDate = newDateStr; // 데이터 업데이트
          
          // 상태 플래그 설정
          if (!params.data._editedFields) params.data._editedFields = {};
          params.data._editedFields.actualDate = true;
          
          params.data._rowState = "UPDATE";
          
          return true; // 중요: true를 반환해야 AG Grid가 변경을 확정함
        }
      }
      return false; // 변경 실패 시 false 반환
    },

      // 4. 에디터 설정
      cellEditorParams: {
        min: '2025-01-01',
        max: '2030-12-31',
      },

      // 5. 조건부 스타일 (배경색)
      cellStyle: (params: CellClassParams) => ({
        textAlign: "center",
        backgroundColor: params.data?._editedFields?.actualDate ? "#FFF3BF" : "#FFF9DB"
      })
    },
	
	{
	  headerName: "실적 수량",
	  field: "actualQty",
	  flex: 1.5,
	  editable: true,
	  cellStyle: (params: CellClassParams ) => ({
	  backgroundColor: params.data?._editedFields?.targetQty ? "#FFF3BF" : "#FFF9DB"
	})
	},
	{ 
	  headerName: "상태", 
	  field: "activityStatus",
	  hide: true,
	  flex: 1, // 약 10%
	  cellStyle: () => ({ display: 'flex', justifyContent: 'center' }),
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
  fetch("/api/wbsExecution/selectCombo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(r => r.json())
	// any[] : 어떤 타입(any)이든 상관없이 요소로 가질 수 있는 배열
    .then((data: SelectBoxData[]) => { 
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

  fetch("/api/wbsExecution/selectList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
  .then((res) => {
    if (!res.ok) throw new Error(`서버 에러: ${res.status}`);
    return res.json();
  })
  .then((data: RowData[]) => {
    rowData.value = data.map((d) => ({
      ...d,
      _editedFields: {},
      _oldValues: { actualDate: d.actualDate,  actualQty: d.actualQty},
      _rowState: "NORMAL", 
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


const onCellValueChanged = (e: CellValueChangedEvent<RowData>) => {
  const row = e.data;
  if (!row) return;
``
  const field = e.colDef.field as keyof RowData;
  const oldValue = e.oldValue;
  const newValue = e.newValue;

  // 1. 값이 변하지 않았다면 아무것도 하지 않음
  if (oldValue === newValue) return;

  // 2. 편집된 필드 기록 객체가 없다면 초기화
  if (!row._editedFields) row._editedFields = {};
  row._editedFields[field as string] = true;

  // 3. 행 상태 변경
  row._rowState = "UPDATE";

  // 4. AG Grid 화면 강제 갱신 (스타일이나 아이콘 변경 반영용)
  e.api.refreshCells({ rowNodes: [e.node], force: true });
};

const handleSave = async () => {
  if (!gridApi.value) return;
  gridApi.value.stopEditing(false);
  
  await nextTick();
  
  const updateList = rowData.value.filter(r => r._rowState === "UPDATE");

  if (updateList.length === 0) {
    return alert("변경 사항이 없습니다.");
  }

  fetch("/api/wbsExecution/saveList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({updateList})
  }).then(r => {
    if (r.ok) {
      alert("저장 완료");
      selectList();
    } else {
      alert("저장 실패");
    }
  });
};


const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
};


watch(activityName, (newVal) => {
  if (newVal === "") outputName.value = "";
  
  const filteredOutMap = new Map<string, string>();
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
        <span style="margin-right: 12px">📋</span>WBS Execution
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
        :rowSelection="{ mode: 'none', 
			          checkboxes: false,
			          headerCheckbox: false}"
        :theme="themeQuartz"
		:getRowId="getRowId"
		:pagination="true"
		:paginationPageSize="20"
		:paginationPageSizeSelector="[10, 20, 50, 100]"
        @grid-ready="onGridReady"
        @cell-value-changed="onCellValueChanged"
      />
    </div>
  </div>
</template>
