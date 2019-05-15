define(['zepto','vue'], function($, Vue){

  var news = {
      data: function(){
        return {

        }
      },
      created: function(){
          console.log('子组件');
      }
  }

  return news;

});