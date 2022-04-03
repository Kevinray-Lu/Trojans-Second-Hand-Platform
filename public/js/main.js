(function ($) {
 "use strict";

    /*---------------------
     jQuery MeanMenu
    --------------------- */
        jQuery('#dropdown').meanmenu();		
	
    /*---------------------
     mixItUp
    --------------------- */	
	$('.portfolio-content').mixItUp();
	
	$("li:first-child.filter").addClass("active");
    
    /*---------------------
     tooltip
    --------------------- */	
	$('[data-toggle="tooltip"]').tooltip(); 	
 
    /*----------------------------
     best-seller-product
    ------------------------------ */  
      $(".best-seller-product").owlCarousel({
          autoPlay: false, 
          slideSpeed:2000,
          pagination:false,
          navigation:true,	  
          items : 4,
          navigationText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
          itemsDesktop : [1199,4],
          itemsDesktopSmall : [980,3],
          itemsTablet: [768,2],
          itemsMobile : [479,1],
      });
    
    /*----------------------------
     feature-product-list
    ------------------------------ */  
      $(".feature-product-list").owlCarousel({
          autoPlay: false, 
          slideSpeed:2000,
          pagination:false,
          navigation:true,	  
          items : 4,
          navigationText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
          itemsDesktop : [1199,4],
          itemsDesktopSmall : [980,3],
          itemsTablet: [768,2],
          itemsMobile : [479,1],
      }); 

    /*----------------------------
     brand-list
    ------------------------------ */  
      $(".brand-list").owlCarousel({
          autoPlay: false, 
          slideSpeed:2000,
          pagination:false,
          navigation:true,	  
          items : 5,
          navigationText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
          itemsDesktop : [1199,4],
          itemsDesktopSmall : [980,3],
          itemsTablet: [768,3],
          itemsTablet : [767,2],
          itemsMobile : [479,1],
      }); 

    /*----------------------------
     blog-from-list
    ------------------------------ */  
      $(".blog-from-list").owlCarousel({
          autoPlay: false, 
          slideSpeed:2000,
          pagination:false,
          navigation:true,	  
          items : 3,
          navigationText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
          itemsDesktop : [1199,3],
          itemsDesktopSmall : [980,3],
          itemsTablet: [768,2],
          itemsMobile : [479,1],
      });

    /*----------------------------
     client-list
    ------------------------------ */  
      $(".about-client-list").owlCarousel({
          autoPlay: false, 
          slideSpeed:2000,
          pagination:true,
          navigation:false,
          transitionStyle : "goDown",
          items : 1,
          itemsDesktop : [1199,1],
          itemsDesktopSmall : [980,1],
          itemsTablet: [768,1],
          itemsMobile : [479,1],
      });

/*----------------------------
 price-slider active
------------------------------ */  
	  $(function() {
	  $( "#slider-range" ).slider({
	   range: true,
	   min: 40,
	   max: 600,
	   values: [ 60, 570 ],
	   slide: function( event, ui ) {
		$( "#amount" ).val( "£" + ui.values[ 0 ] + " - £" + ui.values[ 1 ] );
	   }
	  });
	  $( "#amount" ).val( "£" + $( "#slider-range" ).slider( "values", 0 ) +
	   " - £" + $( "#slider-range" ).slider( "values", 1 ) );
	});
    
    /* --------------------------------------------------------
   payment-accordion
   * -------------------------------------------------------*/ 
	$(".payment-accordion").collapse({
		accordion:true,
	  open: function() {
		this.slideDown(550);
	  },
	  close: function() {
		this.slideUp(550);
	  }		
	}); 
    
    /*-------------------------
      showlogin toggle function
    --------------------------*/
         $( '#showlogin' ).on('click', function() {
            $( '#checkout-login' ).slideToggle(900);
         }); 

    /*-------------------------
      showcoupon toggle function
    --------------------------*/
         $( '#showcoupon' ).on('click', function() {
            $( '#checkout_coupon' ).slideToggle(900);
         });

    /*-------------------------
      Create an account toggle function
    --------------------------*/
         $( '#cbox' ).on('click', function() {
            $( '#cbox_info' ).slideToggle(900);
         });

    /*-------------------------
      Create an account toggle function
    --------------------------*/
         $( '#ship-box' ).on('click', function() {
            $( '#ship-box-info' ).slideToggle(1000);
         });	
    /*--------------------------
     scrollUp
    ---------------------------- */	
	$.scrollUp({
        scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    }); ; 	   
 
})(jQuery); 