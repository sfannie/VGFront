define(['vue','modules/common/indexCommon','modules/index/components/vNews'], function(Vue, C, VNews){

    var app = new Vue({
      el: '#app',
        data: function(){
          return {
            title: C.Constant.title
          }
        },
        created: function(){
          C.baseDialog.tips('Hello Dialog!')
          console.log(C.Constant.ENV);
        },
        methods: {

        }
    });
});