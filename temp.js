var myObj = {
    name : " 极客时间 ", 
    showThis: function(){
      console.log(this)
      function bar(){console.log(this)}
      bar()
    }
  }
  myObj.showThis()