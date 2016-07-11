(function() {
  var BevryApp, wait,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  wait = function(delay, callback) {
    return setTimeout(callback, delay);
  };

  BevryApp = (function() {
    BevryApp.prototype.config = null;

    function BevryApp() {
      this.scrollSpy = bind(this.scrollSpy, this);
      this.stateChange = bind(this.stateChange, this);
      this.anchorChange = bind(this.anchorChange, this);
      this.linkClick = bind(this.linkClick, this);
      this.externalLinkClick = bind(this.externalLinkClick, this);
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
      $(this.onDomReady);
      this;
    }

    BevryApp.prototype.onDomReady = function() {
      this.$document = $(document);
      this.$body = $(document.body);
      this.$window = $(window);
      this.$docnav = $('.docnav');
      this.$docnavUp = this.$docnav.find('.up');
      this.$docnavDown = this.$docnav.find('.down');
      this.$docSectionWrapper = $('<div class="section-wrapper">');
      this.$article = null;
      this.$docHeaders = null;
      this.$body.on('click', 'a[href]:external', this.externalLinkClick).on('click', '[data-href]', this.linkClick);
      this.$window.on('anchorchange', this.anchorChange);
      this.$window.on('statechangecomplete', this.stateChange);
      this.$window.trigger('anchorchange');
      this.$window.trigger('statechangecomplete');
      if (this.scrollSpy != null) {
        setInterval(this.scrollSpy, 500);
      }
      if (this.resize != null) {
        $(window).on('resize', this.resize);
        this.resize();
      }
      return this;
    };

    BevryApp.prototype.openLink = function(arg) {
      var action, url;
      url = arg.url, action = arg.action;
      if (action === 'new') {
        window.open(url, '_blank');
      } else if (action === 'same') {
        wait(100, function() {
          return document.location.href = url;
        });
      } else if (action === 'default') {

      } else {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.log === "function") {
            console.log('unknown link action', action);
          }
        }
      }
      return this;
    };

    BevryApp.prototype.openOutboundLink = function(arg) {
      var action, hostname, ref, url;
      url = arg.url, action = arg.action;
      hostname = url.replace(/^.+?\/+([^\/]+).*$/, '$1');
      if ((ref = window._gaq) != null) {
        ref.push(['_trackEvent', "Outbound Links", hostname, url, 0, true]);
      }
      this.openLink({
        url: url,
        action: action
      });
      return this;
    };

    BevryApp.prototype.externalLinkClick = function(event) {
      var $link, action, url;
      $link = $(event.target);
      url = $link.attr('href');
      if (!url) {
        return this;
      }
      if (event.which === 2 || event.metaKey || event.shiftKey) {
        action = 'default';
      } else {
        action = 'new';
        event.preventDefault();
      }
      this.openOutboundLink({
        url: url,
        action: action
      });
      return this;
    };

    BevryApp.prototype.linkClick = function(event) {
      var $link, action, url;
      $link = $(event.target);
      url = $link.data('href');
      if (!url) {
        return;
      }
      if (event.which === 2 || event.metaKey) {
        action = 'new';
      } else {
        action = 'same';
        event.preventDefault();
      }
      if ($link.is(':internal')) {
        this.openLink({
          url: url,
          action: action
        });
      } else {
        this.openOutboundLink({
          url: url,
          action: action
        });
      }
    };

    BevryApp.prototype.previousSection = function() {
      var $current, $docHeaders, $prev;
      $docHeaders = this.$docHeaders;
      if ($docHeaders == null) {
        return;
      }
      $current = $docHeaders.filter('.current');
      if ($current.length) {
        $prev = $current.prevAll('h2:first');
        if ($prev.length) {
          $prev.click();
        } else {
          $docHeaders.filter('.current').removeClass('current');
          $docHeaders.last().click();
        }
      }
      return this;
    };

    BevryApp.prototype.nextSection = function() {
      var $current, $docHeaders, $next;
      $docHeaders = this.$docHeaders;
      if ($docHeaders == null) {
        return;
      }
      $current = $docHeaders.filter('.current');
      if ($current.length) {
        $next = $current.nextAll('h2:first');
        if ($next.length) {
          $next.click();
        } else {
          $docHeaders.first().click();
        }
      } else {
        $docHeaders.first().click();
      }
      return this;
    };

    BevryApp.prototype.anchorChange = function() {
      var el, hash;
      hash = History.getHash();
      if (!hash) {
        return;
      }
      el = document.getElementById(hash);
      if (!el) {
        return;
      }
      if (el.className.indexOf('anchor-link') !== -1) {
        return $(el).trigger('select');
      } else {
        return $(el).ScrollTo(this.config.sectionScrollOpts);
      }
    };

    BevryApp.prototype.stateChange = function() {
      var $article, $docHeaders, $docSectionWrapper, config;
      $docHeaders = this.$docHeaders, $docSectionWrapper = this.$docSectionWrapper, config = this.config;
      this.$article = $article = $('#content article:first');
      if ($article.is('.block.doc, .block.page')) {
        $article.find('h1,h2,h3,h4,h5,h6').each(function() {
          var id;
          if (this.id) {
            return;
          }
          id = (this.textContent || this.innerText || '').toLowerCase().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
          if (!id || document.getElementById(id)) {
            return;
          }
          this.id = id;
          if (!this.getAttribute('data-href')) {
            this.setAttribute('data-href', '#' + this.id);
          }
          if (this.className.indexOf('hover-link') === -1) {
            return this.className += 'hover-link';
          }
        });
      }
      if ($article.is('.block.doc')) {
        this.$docHeaders = $docHeaders = $article.find('h2');
        if ($article.is('.compact')) {
          $docHeaders.addClass('hover-link anchor-link').each(function(index) {
            var $header;
            $header = $(this);
            return $header.nextUntil('h2').wrapAll($docSectionWrapper.clone().attr('id', 'h2-' + index));
          }).on('select', function(event, opts) {
            var $header;
            $docHeaders.filter('.current').removeClass('current');
            $header = $(this).addClass('current').stop(true, false).css({
              'opacity': 0.5
            }).animate({
              opacity: 1
            }, 1000).prevAll('.section-wrapper').addClass('active').end().next('.section-wrapper').addClass('active').end();
            if (!opts || opts.scroll !== false) {
              return $header.ScrollTo(config.sectionScrollOpts);
            }
          }).first().trigger('select', {
            scroll: false
          });
        } else {
          $docHeaders.addClass('hover-link anchor-link').on('select', function(event, opts) {
            var $header;
            $docHeaders.filter('.current').removeClass('current');
            $header = $(this).addClass('current').stop(true, false).css({
              'opacity': 0.5
            }).animate({
              opacity: 1
            }, 1000);
            if (!opts || opts.scroll !== false) {
              return $header.ScrollTo(config.sectionScrollOpts);
            }
          });
        }
      } else {
        this.$docHeaders = $docHeaders = null;
      }
      $article.ScrollTo(config.articleScrollOpts);
      return this;
    };

    BevryApp.prototype.scrollSpy = function() {
      var $articleNav, pageLeftToRead;
      pageLeftToRead = document.height - (window.scrollY + window.innerHeight);
      $articleNav = this.$article.find('.prev-next a.next');
      if (pageLeftToRead <= 50) {
        $articleNav.css('opacity', 1);
      } else {
        $articleNav.removeAttr('style');
      }
      return this;
    };

    return BevryApp;

  })();

  this.BevryApp = BevryApp;

}).call(this);
