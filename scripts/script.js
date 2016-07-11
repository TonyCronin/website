(function() {
  var App, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App = (function(superClass) {
    extend(App, superClass);

    function App() {
      this.stateChange = bind(this.stateChange, this);
      this.resize = bind(this.resize, this);
      this.onDomReady = bind(this.onDomReady, this);
      var base, base1;
      if (this.config == null) {
        this.config = {};
      }
      if ((base = this.config).articleScrollOpts == null) {
        base.articleScrollOpts = {};
      }
      if ((base1 = this.config).sectionScrollOpts == null) {
        base1.sectionScrollOpts = {};
      }
      this.config.articleScrollOpts.offsetTop = 100;
      this.config.sectionScrollOpts.offsetTop = 80;
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.onDomReady = function() {
      if ($('html').hasClass('no-touch') === false) {
        $(document.body).on('click touchstart', '.logo', (function(_this) {
          return function(e) {
            _this.resize();
            $('.sidebar').addClass('active');
            e.preventDefault();
            return false;
          };
        })(this)).on('click touchstart', '.container', function(e) {
          if ($(e.target).parents('.topbar').length === 0) {
            $('.sidebar').removeClass('active');
          }
          return true;
        });
      }
      return App.__super__.onDomReady.apply(this, arguments);
    };

    App.prototype.resize = function() {
      var $sidebar, $topbar, topbarHeight;
      $sidebar = $('.sidebar');
      if ($('html').hasClass('no-touch')) {
        $topbar = $('.topbar');
        topbarHeight = $topbar.outerHeight();
        $sidebar.find('.list-menu').height($(window).height() - topbarHeight);
        $sidebar.css({
          top: topbarHeight
        });
      } else {
        $sidebar.find('.list-menu').height(parseInt($(window).height(), 10) + 50);
        $sidebar.css({
          top: 0
        });
      }
      return this;
    };

    App.prototype.stateChange = function(event, data) {
      var $activeItemLocal, $activeItemRemote, $activeMenuLocal, $activeMenuRemote, $sidebar, $sidebarRemote, ref;
      $sidebar = $('.sidebar').removeClass('active');
      $sidebarRemote = data != null ? (ref = data.$dataBody) != null ? ref.find('.sidebar') : void 0 : void 0;
      if ($sidebarRemote && $sidebarRemote.length !== 0) {
        $sidebar.find('.active').removeClass('active').addClass('inactive');
        $activeMenuRemote = $sidebarRemote.find('.list-menu-category.active');
        $activeItemRemote = $activeMenuRemote.find('.list-menu-item.active');
        if ($activeItemRemote && $activeItemRemote.length !== 0) {
          $activeMenuLocal = $sidebar.find('.list-menu-category').eq($activeMenuRemote.index()).removeClass('inactive').addClass('active');
          $activeItemLocal = $activeMenuLocal.find('.list-menu-item').eq($activeItemRemote.index()).removeClass('inactive').addClass('active');
        }
      } else {
        $activeMenuLocal = $sidebar.find('.list-menu-category.active');
        $activeItemLocal = $activeMenuLocal.find('.list-menu-item.active');
      }
      this.resize();
      if (!$activeItemLocal || $activeItemLocal.length === 0) {
        $activeItemLocal = $sidebar.find('.list-menu-category:first').addClass('active');
      }
      $activeItemLocal.ScrollTo({
        onlyIfOutside: true
      });
      return App.__super__.stateChange.apply(this, arguments);
    };

    return App;

  })(BevryApp);

  app = new App();

}).call(this);
