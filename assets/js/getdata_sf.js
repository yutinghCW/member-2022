$(function () {
  // 取得日期
  var d = new Date();
  var strDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  // console.log("現在是"+strDate);
  $("#00N2w00000Hh3C1").val(strDate);

  // watch required input
  $(".inputbox .required").focusout(function () {
    if ($(this).val() == "") {
      $(this).siblings(".error.blank").show();
    } else {
      $(this).siblings(".error.blank").hide();
    }
  });

  // 移入INPUT框時移除error
  $(".inputbox .required").focus(function () {
    $(this).siblings(".error").hide();
    $(".errorSubmit").removeClass("show");
  });

  // 離開input後的檢查

  // watch emailbox
  $("body").on("change", "#email", function () {
    $Emailchecking = IsEmail($("#email").val());
    // $("#last_name").val($("#email").val());
    if ($Emailchecking == false) {
      // alert("請填寫正確的email格式");
      $(this).siblings(".error.blank").hide();
      $(this).siblings(".error.wrong").show();
      $("#email").blur(); //離開焦點
    } else {
      $(this).siblings(".error.wrong").hide();
      $("#email").blur(); //離開焦點
    }
  });

  // watch SELECT(下拉選單)
  $("body").on("change", ".selectGroup", function () {
    var thisVal = $(this).val();
    // $("#00N2w00000Hh3Mv").val(thisVal);
    if (thisVal === "") {
      $(this).siblings(".error.blank").show();
    } else {
      $(this).siblings(".error.blank").hide();
      $(".errorSubmit").removeClass("show");
    }
  });

  // watch Policy
  $("body").on("change", "#policy", function () {
    if ($("#policy").is(":checked")) {
      // console.log("CHECKED");
      $(".errorPolicy").hide();
      $("#policy").prop("checked", true);
      $("#00N2w00000Hh3Kk").val("A版");
      $("#00N2w00000Hh3NF").val("同意");
      $(".errorSubmit").removeClass("show");
    } else {
      // console.log("NOT CHECKED");
      $(".errorPolicy").show();
      $("#policy").prop("checked", false);
      $("#00N2w00000Hh3Kk").val("");
      $("#00N2w00000Hh3NF").val("");
      $(".errorSubmit").addClass("show");
    }
  });

  // 檢查email的值
  function IsEmail(email) {
    var regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
      return false;
    } else {
      return true;
    }
  }
  // 檢查mobile的Mobile值
  function IsMobile(mobile) {
    var regex = /^\d*$/;
    if (!regex.test(mobile)) {
      return false;
    } else {
      return true;
    }
  }

  // 檢查是不是數字和#
  function IsPhone(mobile) {
    var regex = /^[0-9#]+$/;
    if (!regex.test(mobile)) {
      return false;
    } else {
      return true;
    }
  }

  // 檢查是不是數字
  function IsNumber(number) {
    var regex = /^[0-9]+$/;
    if (!regex.test(number)) {
      return false;
    } else {
      return true;
    }
  }

  // 監聽 送出 按鈕點擊
  // 下面這段主要在組合資料，還有擋使用者不填資料不能送出
  $("#sendBtn").click(function (e) {
    var status = true;
    // 姓名
    var name = $("#last_name").val();
    // 電子信箱
    var email = $("#email").val();
    // 公司名稱
    var company = $("#company").val();
    // 挑戰狀態
    var challenge = $("#challenge").val();
    // 有同意嗎
    var policy =
      "同意個資:" +
      $("#00N2w00000Hh3Kk").val() +
      ",同意行銷:" +
      $("#00N2w00000Hh3NF").val();
    // 日期
    var time = $("#00N2w00000Hh3C1").val();
    // 活動名稱
    var eventname = $("#00N2w00000Hh3MH").val();
    // 備註欄
    var others = `挑戰狀態：${challenge}`;
    $("#00N2w00000Hh3Mv").val(others);

    // 按下submit後的檢查
    // 再次check email格式
    $Emailchecking2 = IsEmail($("#email").val());
    if ($Emailchecking2 == false) {
      // alert("請填寫正確的email格式");
      status = false;
      $("#email").siblings(".error").hide();
      $("#email").siblings(".error.wrong").show();
      $(".errorSubmit").addClass("show");
    } else {
      // alert("email格式是正確的");
      $("#email").siblings(".error.wrong").hide();
      $(".errorSubmit").removeClass("show");
    }

    // 擋住不填資料邏輯
    // #last_name
    if ($("#last_name").val() == "") {
      $("#last_name").siblings(".error.blank").show();
      $("#last_name").siblings(".error.wrong").hide();
      $(".errorSubmit").addClass("show");
      status = false;
    } else {
      $("#last_name").siblings(".error").hide();
      $(".errorSubmit").removeClass("show");
    }

    // #email
    if ($("#email").val().length == 0) {
      $("#email").siblings(".error.blank").show();
      $("#email").siblings(".error.wrong").hide();
      $(".errorSubmit").addClass("show");
      status = false;
    } else {
      $Emailchecking3 = IsEmail($("#email").val());
      if ($Emailchecking3 == false) {
        status = false;
        $("#email").siblings(".error").hide();
        $("#email").siblings(".error.wrong").show();
        $(".errorSubmit").addClass("show");
      } else {
        $("#email").siblings(".error").hide();
        $(".errorSubmit").removeClass("show");
      }
    }

    // #company
    if (company === "") {
      $("#company").siblings(".error").show();
      $(".errorSubmit").addClass("show");
      status = false;
    } else {
      $("#company").siblings(".error").hide();
      $(".errorSubmit").removeClass("show");
    }

    // check policy
    if (!$("#policy").is(":checked")) {
      // 如果沒同意
      // alert("您需同意天下雜誌集團會員條款才能訂閱");
      $(".errorPolicy").show();
      $(".errorSubmit").addClass("show");
      status = false;
    } else {
      $(".errorPolicy").hide();
      $(".errorSubmit").removeClass("show");
    }

    // 如果必填欄位都過了 才會到這邊
    if (status) {
      // 按下salesforce的按鈕
      // $("#sfBtn").click();
      // 隱藏訂閱區塊
      $(".formbox form").hide();
      // 打包 要的資料
      var data = {
        name: name,
        email: email,
        company: company,
        time: time,
        policy: policy,
        eventname: eventname,
        others: others,
      };
      // 呼叫 send ajax function 把資料送到google sheet
      send(data);
      // alert('感謝，您已完成訂閱!');
      $(".formbox .tks").fadeIn();
    }
  });
});
// 送資料去內部測試google sheet
function send(data) {
  $.ajax({
    // 這邊用get type
    type: "get",
    // 串接內部測試的google sheet的 script編輯頁 - https://script.google.com/d/1DIWS98kPjwxk54KTdvCJy-10msN2RcQRC4LFlguoN5p9WPbHiZ_NIe1o/edit?usp=sharing
    // api url - google appscript 產出的 url
    url: "https://script.google.com/a/cw.com.tw/macros/s/AKfycbwXi4cvSC5W92Rnj3_a15N2OLCLMqMrk4JhAASf/exec",
    // 剛剛整理好的資料帶入
    data: data,
    // 資料格式是JSON
    dataType: "JSON",
    // 成功送出 會回頭觸發下面這塊感謝
    success: function (response) {
      // console.log(response);
      // alert('感謝，您已完成訂閱!');
    },
  });
}
