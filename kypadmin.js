var app = angular.module('KypAdmin',['ngRoute','ngResource','textAngular']);

function MainController($rootScope, $scope, $location,IEM){

  $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
            $scope.htmlcontent = $scope.orightml;
            $scope.disabled = false;


var header = {name:"test", date:"20151231"}
var txt = "hello"
var comment = {header:header, text:"hello3", comment:[]}
var comment3 = {header:header, text:"hello2", comment:[comment]}
var comment2 = {header:header, text:"hello", comment:[comment3]}
$scope.comments = [comment2]
	$scope.profiles = [{id:'1',img:'images/road.jpg',name:'Test',info:'Test',like:'',comments:$scope.comments}]

      $scope.loadProfile=function(p,hash){
      	if(hash != null)
      	$location.hash(hash);
      	$location.path('/profile');
      }



   $scope.input = function(d){


            if($scope.key === 8){
              $scope.key = null;
              $scope.words = "";
              return;
            }

            $scope.data = d;
      /*      if($scope.data.text.length == 1 && $scope.key === 8 ){
               $scope.key = null;
               $scope.words = "";
               return
            }*/

            $scope.data.pinyin?$scope.data.pinyin += $scope.data.text.slice(-1):
                $scope.data.pinyin = $scope.data.text.slice(-1);

            $scope.data.text = $scope.data.text.substring(0,$scope.data.text.length-1);
            IEM.queryText($scope.data.pinyin).success(function(data){
                if(data[0] === "FAILED_TO_PARSE_REQUEST_BODY"){
                    console.log('trigger');
                    $scope.words = "";
                }else{
                    $scope.words = data[1][0][1];
                }
            })
        }

        $scope.select = function(index,data){
            $scope.data = data;
            $scope.data.text += $scope.words[index];
            $scope.words = "";
            $scope.data.pinyin = "";
        }



}

function ProfileController($rootScope, $scope, $location){
var header = {name:"test", date:"20151231"}
var txt = "hello"
var comment = {header:header, text:"hello3", comment:[]}
var comment3 = {header:header, text:"hello2", comment:[comment]}
var comment2 = {header:header, text:"hello", comment:[comment3]}
$scope.comments = [comment2,comment3]

$scope.recaptcha = function() {
	    grecaptcha.render('html_element', {
          'sitekey' : '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN'
        });
}

}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {templateUrl: 'list.html',   controller: MainController}).
      when('/edit', {templateUrl: 'edit.html',   controller: ProfileController}).
      otherwise({
        redirectTo: '/'
      });
  });

app.factory('IEM',function($http){
        var url = "https://inputtools.google.com/request?text=n&itc=ta-t-i0-pinyin&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&app=demopage"
        return{
            queryText:function(txt){
                return $http.post("https://inputtools.google.com/request?&itc=ta-t-i0-und&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&text="+txt);
            }
        }
    });

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 8 && scope.data.text.length > 0) {
                scope.key = 8;
            }else{
              scope.key = null;
            }
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);

                });
 
                event.preventDefault();
            }
        });
    };
});
