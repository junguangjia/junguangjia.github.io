/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

// The current page's tab never folds into the menu: the tab pages have no
// visible title, so the tab bar is what names the page on narrow screens.
// Each item remembers its place so it returns to it when there is room again.
var movable = "*:not(.persist):not(.selected)";
$vlinks.children().each(function (i) { $(this).attr("data-nav-order", i); });

var breaks = [];

function updateNav() {

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

  // The visible list is overflowing the nav
  if ($vlinks.width() > availableSpace) {

    while ($vlinks.width() > availableSpace && $vlinks.children(movable).length > 0) {
      // Record the width of the list
      breaks.push($vlinks.width());

      // Move item to the hidden list
      $vlinks.children(movable).last().prependTo($hlinks);

      availableSpace = $btn.hasClass("hidden") ? $nav.width() : $nav.width() - $btn.width() - 30;

      // Show the dropdown btn
      $btn.removeClass("hidden");
    }

    // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
      // Move the item back to its original place in the visible list
      var $item = $hlinks.children().first();
      var order = +$item.attr("data-nav-order");
      var $next = $vlinks.children().filter(function () { return +$(this).attr("data-nav-order") > order; }).first();
      if ($next.length) { $item.insertBefore($next); } else { $item.appendTo($vlinks); }
      breaks.pop();
    }

    // Hide the dropdown btn if hidden list is empty
    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $btn.removeClass('close');
      $hlinks.addClass('hidden');
    }
  }

  // Keep counter updated
  $btn.attr("count", breaks.length);

  // update masthead height and the body/sidebar top padding
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }

}

// Window listeners

$(window).on('resize', function () {
  updateNav();
});
screen.orientation.addEventListener("change", function () {
  updateNav();
});

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();