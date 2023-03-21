import { ref, reactive, computed, watch, onMounted } from "vue";

// export const createPaging = () => {

//     return reactive({
//         pageNum: 1,
//         pageSize: 50,
//         total: 213,
//     });
// }
// export const createGetTableFun = (getListApi: Function, params: any) => {

//     getListApi(params).then((res: any) => {
//         console.log("getCompanyListApi", params);
//         // tableDataList.value = res.data.list;

//         // pageParams.total = res.data.total;
//     });
//     // return  
// }
export default (getListApi: Function, searchForm: any, beforeQuery: Function) => {
    const pageParams = reactive({
        pageNum: 1,
        pageSize: 50,
        total: 0,
    });

    const tableDataList = ref<any>([]);

    const handlePageChange = (pageNum: number) => {
        let searchFormBack = (beforeQuery()) || {};
        let params = {
            pageNum: pageNum,
            pageSize: pageParams.pageSize,
            ...searchFormBack
        };
        getListApi(params).then((res: any) => {
            tableDataList.value = res.data.list;
            pageParams.total = res.data.total;
            pageParams.pageNum = pageNum;
        });
    };

    const resetPageToOne = () => {

        handlePageChange(1)
    };
    onMounted(() => {
        resetPageToOne();
    })
    return {
        pageParams,
        tableDataList,
        handlePageChange,
        resetPageToOne
    }


}
