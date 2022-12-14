document.write('<script src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>');
document.write('<script src = "https://code.highcharts.com/highcharts.js"></script>');
document.write('<script src="https://d3js.org/d3.v4.min.js"></script>');

const select_result_last = document.getElementById('select_result_last');
const select_result_total = document.getElementById('select_result_total');
const select_result_more = document.getElementById('select_result_more');
const url = new URL(window.location.href);


// 문의 후 키 발급 후 사용 가능, CompanyKey
// CardiVu API 문의 : http://www.sdcor.net/contact
// API가 사용되고 있는 CardiVu-W 사이트 : https://www.cardivu.com/
// 측정 종료시 측정된 홍채 데이터의 시작(START_IDX)~끝(LAST_IDX) ,회사(CompanyCode, CompanyKey), 측정된 사용자(CompanyClient)의 정보를 전달해야됨
//TODO: CompanyCode,Key,Client property에 넣고 gitignore에 추가하기
const CardiVuAPI_Domain = "https://www.cardivu.com/";
const CardiVuAPI_Domain_Link = CardiVuAPI_Domain + "api/select_result";
const CompanyCode = "";
const CompanyKey = "f";                   // 회사 인증키
const CompanyClient = 'CompanyClient_Key';          // 회사의 회원별 고유키

const urlParams = url.searchParams;

let START_IDX = urlParams.get("sidx");  // 첫 시작시 홍채 변수 IDX, 임의로 90220 입력함
let LAST_IDX = urlParams.get("lidx");   // 마지막 홍채 변수 IDX, 임의로 90287 입력함

async function fetch_select_result_more(START_IDX, LAST_IDX) {
    let formData = new FormData();
    formData.append('CompanyCode', CompanyCode);
    formData.append('CompanyKey', CompanyKey);
    formData.append('CompanyClient', CompanyClient);
    formData.append('Option', 2);
    formData.append('START_IDX', START_IDX);
    formData.append('LAST_IDX', LAST_IDX);

    try {
        let response = await fetch(CardiVuAPI_Domain_Link, {
            method: "POST",
            Headers: {'Content-Type': 'application/json'},
            body: formData
        });

        if (response.status == 200) {
            let result = await response.json();
            console.log(result);

            const arr = [];
            for (let i = 0; i < result.Data.length; i++){
                arr[i] = result.Data[i].BPM;
            }

            $(document).ready(function() {
                let title = {
                    text: '실시간 맥박 데이터'
                };
                let subtitle = {
                    text: '심장박동수 실시간 체크'
                };
                let xAxis = {
                    categories: ['1', '2', '3', '4', '5', '6',
                        '7', '8', '9', '10', '11', '12', '13', '14', '15']
                };
                let yAxis = {
                    title: {
                        text: 'BPM'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                };


                let series =  [{
                    name: 'BPM',
                    data: arr
                }
                ];

                let json = {};
                json.title = title;
                json.subtitle = subtitle;
                json.xAxis = xAxis;
                json.yAxis = yAxis;
                json.series = series;

                $('#container').highcharts(json);

                // 표준 편차 구하기
                var deviation = d3.deviation(arr).toFixed(2); //표준편차
                document.getElementById('deviation').innerText +=  " " + deviation
                console.log("표준 편차 " + deviation)

                if(deviation >= 2.5){
                    document.getElementById('noti-sub').innerHTML = "당신은 '라이어'입니다";
                }
                else{
                    document.getElementById('noti-sub').innerHTML = "당신은 '라이어'가 아닙니다";
                }
            });

        } else {
            throw new Error(response.status);
        }
    } catch (e) {
        console.log('fetch_select_result_more : ' + e);
    }
}



async function fetch_select_result_last() {
    let formData = new FormData();
    formData.append('CompanyCode', CompanyCode);
    formData.append('CompanyKey', CompanyKey);
    formData.append('CompanyClient', CompanyClient);
    formData.append('Option', 0);
    formData.append('START_IDX', -1);
    formData.append('LAST_IDX', -1);

    try {
        let response = await fetch(CardiVuAPI_Domain_Link, {
            method: "POST",
            Headers: {'Content-Type': 'application/json'},
            body: formData
        });

        if (response.status == 200) {
            let json = await response.json();
            console.log(json);
            START_IDX = json.Data[0].STARTIDX;
            LAST_IDX = json.Data[0].LASTIDX;
        } else {
            throw new Error(response.status);
        }
    } catch (e) {
        console.log('fetch_select_result_last : ' + e);
    }
}

async function fetch_select_result_total() {
    let formData = new FormData();
    formData.append('CompanyCode', CompanyCode);
    formData.append('CompanyKey', CompanyKey);
    formData.append('CompanyClient', CompanyClient);
    formData.append('Option', 1);
    formData.append('START_IDX', -1);
    formData.append('LAST_IDX', -1);

    try {
        let response = await fetch(CardiVuAPI_Domain_Link, {
            method: "POST",
            Headers: {'Content-Type': 'application/json'},
            body: formData
        });

        if (response.status == 200) {
            let json = await response.json();
            console.log(json);
        } else {
            throw new Error(response.status);
        }
    } catch (e) {
        console.log('fetch_select_result_total : ' + e);
    }
}

fetch_select_result_last();     // 마지막 결과 가져오기
fetch_select_result_more(START_IDX, LAST_IDX);     // 상세 결과 가져오기
fetch_select_result_total();    // 전체 평균 결과 가져오기

