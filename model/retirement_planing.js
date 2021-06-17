var myChart;
$("#submit_btn").on('click',function(event){
    event.preventDefault();
    //console.log('submitted');

    var user = {};
    var form = document.querySelector(".contactForm");
    var listInput  = form.querySelectorAll("input");
    for (var i = 0;i< listInput.length;i++){
        user[listInput[i].id] = listInput[i].value;
    }
    

    user.year = user.retirementAge - user.currentAge;
    user.lastYearIncome = user.income*Math.pow(1+user.increase/100,user.year-1);
    var retirementPaymentMoney = user.lastYearIncome*user.retirementPay/100;
    
    //console.log(user);

    var beginningRetirementBalance = [];
    var investmentGrowth = [];
    var contributions =  [];
    var retirementWithdrawals = [];
    var endingRetirementBalance = [];
    beginningRetirementBalance.push(parseInt(user.saving));
    investmentGrowth.push(user.saving*user.rateBefore/100);
    contributions.push(user.income*user.annualSaving/100);
    retirementWithdrawals.push(0);
    var tmp = beginningRetirementBalance[0]+investmentGrowth[0]+contributions[0]+parseInt(user.pension)-retirementWithdrawals[0];
    endingRetirementBalance.push(tmp);
    
    // console.log(beginningRetirementBalance);
    // console.log(investmentGrowth);
    // console.log(contributions);
    // console.log(retirementWithdrawals);
    // console.log(endingRetirementBalance);

    var i = parseInt(user.currentAge)+2;
    check = beginningRetirementBalance[0]; 
    while ( check > 0 ){
        beginningRetirementBalance.push(LastValue(endingRetirementBalance));
        var rate;
        if (i < user.retirementAge) rate = user.rateBefore;
        else rate =user.rateAfter;
        investmentGrowth.push(LastValue(beginningRetirementBalance)*rate/100);
        if (i< user.retirementAge) contributions.push((user.income*parseInt(user.annualSaving)/100)*Math.pow(1+parseInt(user.increase)/100,i-parseInt(user.currentAge)-1));
        else contributions.push(0);
        if (user.retirementAge > i) retirementWithdrawals.push(0);
        else retirementWithdrawals.push(retirementPaymentMoney*Math.pow(1+user.inflation/100,i-user.retirementAge));
        endingRetirementBalance.push(LastValue(beginningRetirementBalance)+LastValue(investmentGrowth)+LastValue(contributions)+parseInt(user.pension)-LastValue(retirementWithdrawals));
        check = LastValue(beginningRetirementBalance);
        i++;

        if (LastValue(endingRetirementBalance)<0) endingRetirementBalance[endingRetirementBalance.length-1]=0;
        if (LastValue(beginningRetirementBalance)<0) beginningRetirementBalance[beginningRetirementBalance.length-1]=0;
    }
    var start = parseInt(user.currentAge)+1;
    var end = parseInt(user.retirementAge)+parseInt(user.yearsRetirement);
    end = i-2;

    var notification = `Bạn sẽ nghỉ hưu vào ${user.year} năm tới. Với mức tăng thu nhập hằng năm là ${user.increase}%, thu nhập vào năm cuối cùng trước khi về hưu của bạn sẽ là ${user.lastYearIncome.toFixed(2)} VND. ${user.retirementPay}% thu nhập năm cuối cùng trước khi về hưu của bạn sẽ được ước tính là chi tiêu hằng năm trong giai đoạn hưu trí của bạn tương ứng ${retirementPaymentMoney.toFixed(2)} VND. Giá trị này sẽ tăng theo tỷ lệ lạm phát sau đó.Tuy nhiên, có thể bạn cần phải điều chỉnh kế hoạch về hưu của mình đôi chút vì quỹ tiết kiệm về hưu của bạn sẽ cạn kiệt vào năm bạn ${end} tuổi. Xem biểu đồ minh hoạ bên dưới.`
    document.getElementById("result").innerHTML = `<p style="color : #696592; text-align : justify">${notification}</p>`;
    var listLabels = [];
    for (var i = start;i<= end;i++) listLabels.push(i);

    // console.log(beginningRetirementBalance);
    // console.log(investmentGrowth);
    // console.log(contributions);
     //console.log(retirementWithdrawals);
    // console.log(endingRetirementBalance);
    
    
    drawChart(listLabels,endingRetirementBalance,retirementWithdrawals);

    var header = ``;
    var inner = ``;
    for (var i= 0;i< beginningRetirementBalance.length;i++)
    {
        var age = parseInt(user.currentAge) +i+1;
        inner = inner + `<tr>
                        <th scope="row">${age}</th>
                        <td>${beginningRetirementBalance[i].toFixed(2)}</td>
                        <td>${investmentGrowth[i].toFixed(2)}</td>
                        <td>${contributions[i].toFixed(2)}</td>
                        <td>${retirementWithdrawals[i].toFixed(2)}</td>
                        <td>${retirementWithdrawals[i].toFixed(2)}</td>
                        <td>${user.pension}</td>
                        <td>${endingRetirementBalance[i].toFixed(2)}</td>
                    </tr>`
    }

    var table = `<table class="table table-bordered">
                    <thead style="background-color: #1bb1dc; color : white">
                    <tr>
                        <th scope="col">Tuổi</th>
                        <th scope="col">Số dư Quỹ tiết kiệm Hưu trí đầu kỳ</th>
                        <th scope="col">Tăng trưởng của Quỹ</th>
                        <th scope="col">Đóng góp vào Quỹ tiết kiệm Hưu trí</th>
                        <th scope="col">Nghỉ hưu với 50% thu nhập năm cuối cùng</th>
                        <th scope="col">Khoản tiền rút ra từ Quỹ để phục vụ chi tiêu</th>
                        <th scope="col">Thu nhập từ lương hưu hoặc các nguồn khác</th>
                        <th scope="col">Số dư Quỹ tiết kiệm Hưu trí cuối kỳ</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${inner}
                    </tbody>
                </table>`;
    document.getElementById("table").innerHTML = table;

});

function LastValue(list ){
    return list[list.length-1];
}
function drawChart(listLabels,data1, data2) {
    //myChart = document.getElementById("line-chart").getContext("2d");
    if (myChart != null) myChart.destroy();
    myChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: listLabels,
          datasets: [{ 
              data: data1,
              label: "Ending Retirement Balance",
              borderColor: "#ea7d32",
              fill: false
            }, { 
              data: data2,
              label: "Retirement Withdrawals",
              borderColor: "#4763c4",
              fill: false
            },
          ]
        },
        options: {
          title: {
            display: true,
            text: 'World population per region (in millions)'
          }
        }
      });
  }