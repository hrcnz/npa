// react
var React           = require("react"),
    ReactDOM        = require("react-dom"),
    Router          = require("react-router"),
    Fluxxor         = require("fluxxor"),
    ga              = require("react-ga")

// flux 
var actions         = require("actions"),
    routes          = require("routes")
    
//stores
var RouteStore      = require("stores/route-store"),
    EntityStore     = require("stores/entity-store"), 
    PrintStore     = require("stores/print-store") 

//utils
var loadData        = require('utils/load-data')

// tabletop
var Tabletop        = require('tabletop').Tabletop
window.Tabletop     = Tabletop

//helpers
var _               = require('lodash')
var log             = require('debug')('src:app')


ga.initialize('UA-51960056-3');

//TODO set with config | environment variable
//localStorage.setItem("debug", "*");

var router = Router.create({
  routes: routes,
  location: Router.HashLocation
})

// the google spreadsheet key
// TEST V2 
//var key = '1kaPzwJDFmA1WyUrvb5nDE6fIKWAy_6TC3rOun-FrhcY'
//var isProxy = false        
// PRODUCTION V2 
var key = '1I38ZaDXQvtXKWWOtCU7HtvC5Z8IcH5WOPQnBXcbZPbI'
var isProxy = true


var bucket = 'npabuffer'

var entityStoreConfig = {
  key : key,
  bucket : bucket,
  loadData : loadData, // entity store loads its data using this function
  isProxy : isProxy
}

// initialise stores
var stores = {
  routes:  new RouteStore({ router: router }),
  printer:  new PrintStore({}),
  actions: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'actions',
    type:'action', 
    title:{single:'Government Action',plural:'Government Actions'}})),  
  recommendations: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'recommendations', 
    type:'recommendation', 
    title:{single:'UPR Recommendation',plural:'UPR Recommendations'}})),  
  issues: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'issues', 
    type:'issue', 
    title:{single:'Issue',plural:'Issues'}})),  
  groups: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'groups', 
    type:'group', 
    title:{single:'Population Group',plural:'Population Groups'}})),  
  agencies: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'agencies', 
    type:'agency', 
    title:{single:'Government Agency',plural:'Government Agencies'}})),  
  treatybodies: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'treatybodies', 
    type:'treatybody', 
    title:{single:'Treaty Body',plural:'Treaty Bodies'}})),  
  articles: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'articles', 
    type:'article', 
    title:{single:'Article',plural:'Article'}})),  
  faq: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'faq', 
    type:'faq', 
    title:{single:'Question',plural:'Questions'}})),  
  sessions: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'sessions', 
    type:'session', 
    title:{single:'Session',plural:'Sessions'}})),  
  pages: new EntityStore(_.extend({},entityStoreConfig,{ 
    sheet: 'pages', 
    type:'page', 
    title:{single:'Page',plural:'Pages'}}))  
}

log('init flux...')
var flux = new Fluxxor.Flux(stores, actions.methods);

// run application
router.run(
  function(Handler,state) {
    log('rendering app...')
    ga.pageview(state.pathname)
    ReactDOM.render(
      React.createElement(Handler, { flux: flux }),
      document.getElementById("app")
    );
  }
);