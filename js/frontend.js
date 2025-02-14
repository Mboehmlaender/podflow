function dirname(path) {
    return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}	

 //CKEditor initialisieren
	function enableEditing(editbox) {
				CKEDITOR.replace(editbox);
				CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
			
		}	
	function disableEditing(editbox) {
				CKEDITOR.instances[editbox].destroy();
		}
function check_sortable(){
	if($("#edit_cat_link").hasClass("edit_mode"))
	{
	$(".timeline").each(function(){
		if( (($(this).attr('max_entries') > 0) && ($(this).attr('max_entries') <= $(this).children("li").length)) || ($(this).hasClass('no_change')) )
		{
			$(this).removeClass('kanban_sortable')
			$(this).removeClass("timeline_move");
		}
		else{		
	if($(this).not('.kanban_sortable'))
	{
		$(this).addClass('kanban_sortable');
		$(this).addClass("timeline_move");

	}


	$( ".kanban_sortable" ).sortable({ 
		connectWith: '.kanban_sortable',				
		});
	}
});
	}
};
//Eigene Beiträge: Filter der Podcasts laden	
function podcast_list_change(){
	var baseUrl = dirname(window.location.href);

	var podcast_list = [];
	$(".active_content").each(function(){
		var podcast = $(this).attr('id_podcast_list');
		podcast_list.push(podcast)
	});
	
	var podcast_list = podcast_list.toString();
		$.ajax({
				url: baseUrl+"/inc/check.php?filter_podcast=1",
				type: "POST",
				context: this,
				data: {	"podcast_list":podcast_list, 
					},								
				success: function(data)
					{
						console.log(data);
						$("#podcast_filter").html(data);
					},
});
};



//Eigene Beiträge: Filter der Episoden laden
function episode_list_change(){
	var baseUrl = dirname(window.location.href);
	var episode_list = [];
	$(".active_content").each(function(){
		var episodes = $(this).attr('id_episode_list');
		episode_list.push(episodes)
	});
	
	var episode_list = episode_list.toString();
	
		$.ajax({
				url: baseUrl+"/inc/check.php?filter_episode=1",
				type: "POST",
				context: this,
				data: {	"episode_list":episode_list, 
					},								
				success: function(data)
					{
						console.log(data);
						$("#episode_filter").html(data);
					},
				});
};

//Notizen speichern
function save_note(id, type){
	var baseUrl = dirname(window.location.href);
	var editbox = type+"_notice_edit_"+id;
	var name = "INFO";
	var table = type;
	var pk = id;
	var value= CKEDITOR.instances[editbox].getData();
	if(value === '')
	{
		$("#notice_toggle_" + table + "_" + pk).hide("fast");
	}
	else{
		
		$("#notice_toggle_" + table + "_" + pk).show("fast");
	}
			$.ajax({
			url: baseUrl+"/inc/update.php",
			type: 'POST',
			data: {name:name, pk:pk, value:value, table:table},
			success: function(data){
			console.log(data);
			$.gritter.add({
				title: 'OK!',
				text: 'Die Notizen wurden gespeichert!',
				image: '../images/confirm.png',
				time: '1000'
			});		
			}
		});
}

//Eigene Beiträge: Auswahl der Kategorien laden
function get_unchecked_categories(){
	var baseUrl = dirname(window.location.href);

	$(".change_episode").each(function(){
	var episode = $(this).children('option:selected').attr('id_episode');
	var category = $(this).attr('id_category');
	var table = $(this).attr('table');
	var id_entry = $(this).attr('id_entry');

		$.ajax({
			url: baseUrl+"/inc/check.php?get_categories_unchecked=1",
			type: "POST",
			context: this,
			data: {	"episode":episode, 
			"category":category, 
			"table":table,
			"id_entry":id_entry
				},								
			success: function(data)
				{
					$(this).closest('.lead').find('.change_div').empty();
					$(this).closest('.lead').find('.change_div').append(data);
					var category = $(this).children('option:selected').attr('id_category');
					var cat_origin = $(this).attr('cat_origin');
	
					if(category == cat_origin)
					{
						$(this).find('[noselect]').removeAttr('selected')
					}					
				},
			});
		});
}


//Eigene Beiträge: Pagination
pageSize = 15;
pageCountAll =  $(".active_content").length / pageSize;

function paginate(count){
for(var i = 0 ; i<count;i++){
	$("#pagin").append('<li class="page-item"><div class="page-link" >'+(i+1)+'</div></li></nav> ');
}
$("#pagin li").first().find("a").addClass("current")
showPage = function(page) {
	$(".active_content").hide();
	$(".active_content").each(function(n) {
		if (n >= pageSize * (page - 1) && n < pageSize * page)
			$(this).show();
	});        
}

showPage(1);

$("#pagin li div").click(function() {
	$("#pagin li div").removeClass("current");
	$(this).addClass("current");
	showPage(parseInt($(this).text())) 
});
}		
paginate(pageCountAll);

$(".change_episode").on('change', function(){
	var baseUrl = dirname(window.location.href);

	
	var id_entry = $(this).attr('id_entry');
	var episode_current = $("option:disabled", this).attr('id_episode');
	var episode_new = $("option:selected", this).attr('id_episode');
	var table = $(this).attr('table');
	$.ajax({
		url: baseUrl+"/inc/update.php?set_episode_new=1",
		type: "POST",
		data: {	"id_entry":id_entry, 
				"table":table, 
				"episode_new":episode_new,
			},								
		success: function(data)
			{
				episode_list_change();						
				console.log(data);
				$.gritter.add({
					title: "OK!",
					text: "Beitrag wurde verschoben",
					image: "images/confirm.png",
					time: "1000"
				});	
			},
		}); 
	get_unchecked_categories()
	$("option:selected", this).attr('disabled', true);
	$("option:selected", this).attr('selected', true);
	$("option", this).not(":selected").attr('disabled', false);
	$("option", this).not(":selected").attr('selected', false);
	$(this).closest("li").attr('id_episode_list', episode_new);
	if( ( episode_current !== episode_new) && ( $("#set_episode").children('option:selected').attr('id_episode') !== 'all') )
		{
			$(this).closest("li").removeClass('active_content');
			$(this).closest("li").hide("fast");
			$("#pagin").empty();
			var pageCount =  $(".active_content").length / pageSize;
			paginate(pageCount)
			}
});
		

//Eigene Beiträge: Auf Podcast filtern
function filter_podcast(){
	$("#pagin").empty();
	var id_podcast = $("option:selected", this).attr('id_podcast');
	$('#set_episode option:first').prop('selected', true);		
	if($("option:selected", this).attr('id_podcast') == 'all')
	{
		$(".episodes").addClass('active_content');
		$("[id_podcast_menu]").show();
		$(".episode_menu_all").attr('id_podcast_menu', 'all');
		$('.episodes').show("fast");		
		var pageCount =  $(".active_content").length / pageSize;
	}
	
	else
	{
		$(".episodes").removeClass('active_content');
		
		$('.episode_menu').not("[id_podcast_menu='"+id_podcast+"']").hide();
		$("[id_podcast_menu='"+id_podcast+"']").show();
		$(".episode_menu_all").attr('id_podcast_menu', id_podcast);				

		$('.episodes').not("[id_podcast_list='"+id_podcast+"']").hide("fast");
		$("[id_podcast_list='"+id_podcast+"']").show("fast");
		
		$("[id_podcast_list='"+id_podcast+"']").addClass('active_content');
		var pageCount =  $(".active_content").length / pageSize;
	}
		paginate(pageCount);	
}

//Eigene Beiträge: Auf Episode filtern
function filter_episode(){
$("#pagin").empty();
	var id_podcast = $("option:selected", this).attr('id_podcast_menu');
	var id_episode = $("option:selected", this).attr('id_episode');
	if((id_episode === 'all') && (id_podcast ==='all'))
	{
		$(".episodes").addClass('active_content');
		$("[id_podcast_list]").show("fast");
		var pageCount =  $(".active_content").length / pageSize;
	}
	else if((id_episode === 'all') && (id_podcast !=='all'))
	{
		$(".episodes").removeClass('active_content');
		$("[id_podcast_list='"+id_podcast+"']").show("fast");
		$("[id_podcast_list='"+id_podcast+"']").addClass('active_content');
		var pageCount =  $(".active_content").length / pageSize;
	}
	else
	{
		$(".episodes").removeClass('active_content');
		$('.episodes').not("[id_episode_list='"+id_episode+"']").hide("fast");
		$("[id_episode_list='"+id_episode+"']").show("fast");
		$("[id_episode_list='"+id_episode+"']").addClass('active_content');
		var pageCount =  $(".active_content").length / pageSize;
	}
	
	paginate(pageCount);
}
	
//Timelinereihenfolge speichern

function save_order_kanban(id_cat){
	var baseUrl = dirname(window.location.href);

	var sortable_data = $("#"+id_cat).sortable("serialize"); 
	console.log(sortable_data);
	$.ajax({
		url: baseUrl+"/inc/update.php?set_order=1",
		type: "POST",
		data: sortable_data,
		success: function(data)
			{
				console.log(data);
			},
		});  
}	

//Links/Themen checken
function check_link(id, table){
	var baseUrl = dirname(window.location.href);

	$("#check_"+id).blur();
	var check_icon = "<i class='far fa-check-circle'></i>";
	$("#entry_buttons_" + table + id).hide("fast");
	$("#toggle_entry_buttons_" + table + "_" + id).attr('angle', 0);	
	$("#toggle_entry_buttons_" + table + "_" + id).css({'transform': 'rotate(' + 0 + 'deg)'});	
	if ($("#check_"+table+id).attr("data-checked") == "1")
		{
			$("#panel_" + table + "_" + id).removeClass("entry_done");
			var value = "0";
			$("#check_"+table+id).removeClass("btn-success");
			$("#check_"+table+id).addClass("btn-outline-success");
			$("#check_"+table+id).css("background-color", "transparent");
			$("#check_"+table+id).css("color", "#28a745");
			$("#check_"+table+id).css("border-color", "#28a745");
			$(".check_icon_"+table+"_"+id).html("");
			$.gritter.add({
				title: "OK",
				text: "Link/Thema entcheckt!",
				image: "images/delete.png",
				time: "1000"
			});	
		}
	else
		{
			$("#panel_" + table + "_" + id).addClass("entry_done");
			var value = "1";
			$("#check_"+table+id).removeClass("btn-outline-success");
			$("#check_"+table+id).addClass("btn-success");
			$("#check_"+table+id).css("background-color", "#28a745");
			$("#check_"+table+id).css("color", "white");
			$("#check_"+table+id).css("border-color", "#28a745");
			$(".check_icon_"+table+"_"+id).html(check_icon);
			$.gritter.add({
				title: "OK",
				text: "Link/Thema gecheckt!",
				image: "images/confirm.png",
				time: "1000"
			});	
		}

	$("#check_"+table+id).attr("data-checked",value);
	var pk = id;
	var name = $("#check_"+table+id).attr("data-name");
	$.ajax({
		url: baseUrl+"/inc/update.php?update_links=1",
		type: "POST",
		data: {	"name":name, 
				"pk":pk, 
				"value":value, 
				"table":table 
			},
		success: function(data)
			{
				$("#topic_entries"+id).load(" #topic_entries"+id+ "> *")
				console.log(data);
			},
		}); 						
}	

//Link kopieren Meldung
function copy_link(){
	$.gritter.add({
		title: "Link kopiert",
		text: "Der Link wurde in die Zwischenablage kopiert!",
		image: "images/confirm.png",
		time: "1000"
	});		
}


$(document).ready(function(){
var baseUrl = dirname(window.location.href);

//Eigene Beiträge: Kategorie ändern laden
$(".change_div").on("change", ".change_category", function(){
	var episode = $(this).children('option:selected').attr('id_episode');
	var category = $(this).children('option:selected').attr('id_category');
	var table = $(this).attr('table');
	var id_entry = $(this).attr('id_entry');
		$.ajax({
			url: baseUrl+"/inc/update.php?up_cat=1",
			type: "POST",
			context: this,
			data: {	"episode":episode, 
			"category":category, 
			"table":table,
			"id_entry":id_entry
				},								
			success: function(data)
				{
					location.reload();
				},
			});	
		});

	//Timeline: Sortable
	$( ".kanban_sortable" ).sortable({ 
		handle: '.timeline-handle',
		receive: function( event, ui){
			var cat_id_receiver = event.target.getAttribute('cat_id');
			var cat_id_current = ui.item.attr("cat");
			
			var old_anzahl = $("#cat_" + cat_id_receiver + "_number_user").text();
			var old_anzahl_old = $("#cat_" + cat_id_current + "_number_user").text();							
			
			var old_anzahl_gesamt = $("#cat_" + cat_id_receiver + "_number_all").text();
			var old_anzahl_old_gesamt = $("#cat_" + cat_id_current + "_number_all").text();
			
			var new_anzahl_receiver = parseInt(old_anzahl)+1;
			var new_anzahl_current = parseInt(old_anzahl_old)-1;							
			
			var new_anzahl_receiver_gesamt = parseInt(old_anzahl_gesamt)+1;
			var new_anzahl_current_gesamt = parseInt(old_anzahl_old_gesamt)-1;
			
			var pk = ui.item.attr("data-pk");
			var table = ui.item.attr("table");
			$.ajax({
				url: baseUrl+"/inc/update.php?set_category_sortable=1",
				type: "POST",
				data: {	"cat_id":cat_id_receiver, 
						"table":table, 
						"pk":pk 
					},								
				success: function(data)
					{
						console.log(data);
						$("#cat_" + cat_id_receiver + "_number_user").text(new_anzahl_receiver);
						$("#cat_" + cat_id_current + "_number_user").text(new_anzahl_current);										
						
						$("#cat_" + cat_id_receiver + "_number_all").text(new_anzahl_receiver_gesamt);
						$("#cat_" + cat_id_current + "_number_all").text(new_anzahl_current_gesamt);
						ui.item.attr("cat", cat_id_receiver)

					},
				}); 
			},
		update: function( event, ui){
			var id = $(this).attr('id');
					save_order_kanban(id);
					check_sortable()
			},						
		});	

	//Notizen ein/ausblenden 
	$(".toggle_notice").on("click", function(){
		var type = $(this).attr("type");
		var id_entry = $(this).attr("id_entry");
		$("#" + type + "_notice_" + id_entry).toggle("fast");			
		
		if ($(this).hasClass('show'))
		{
		$(this).removeClass('fas');
		$(this).addClass('far');
			$(this).removeClass("show");
		}
		else
		{
		$(this).removeClass('far');
		$(this).addClass('fas');
			$(this).addClass("show");
		}
	});

	//Action-Schaltflächen auf/zuklappen
	$(".toggle_entry_buttons").on("click", function(){
		var type = $(this).attr("type");
		var entry_id = $(this).attr("entry_id");
			if($("#entry_buttons_" + type + entry_id).css('display') == 'none')
			{
				var angle = 90;
			}
			else
			{
				var angle = 0;
			}
			$(this).attr('angle', angle);	
			$(this).css({'transform': 'rotate(' + angle + 'deg)'});	
			$("#entry_buttons_" + type + entry_id).toggle("slow");
	});

	// Beitrag bearbeiten
															
	$(".edit_entry").on("click", function(){
		var edit_id = $(this).attr("edit_id");
		var edit_type = $(this).attr("edit_type");
		var editbox = edit_type + "_notice_edit_" + edit_id;
		var save_button = "<button class='btn btn-outline-success btn-block save_note' onclick='save_note("+edit_id+",\""+edit_type+"\")' id='update_notizen_"+edit_type+edit_id+"'><i class='fas fa-save'></i> Notizen Speichern</button>";
		if(edit_type == "topics")
		{
			if($("#topics_edit_button_"+edit_id).hasClass("active_edit"))
			{
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('fas');
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('far');
				$("#savebutton" + edit_type + edit_id).empty()
				disableEditing(editbox);
				$("#" + editbox).attr('contenteditable', false)
				$("#" + edit_type + "_notice_" + edit_id).hide("fast");			
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('show');	
				$(".link_topic_delete_"+edit_id).removeClass("col-xl-4 col-12");
				$(".link_topic_delete_"+edit_id).removeAttr("style");
				$(".link_topic_delete_"+edit_id).empty();
				$(this).removeClass("btn-tertiary"),			
				$(this).addClass("btn-outline-tertiary"),

				$("#topics_edit_button_"+edit_id).removeClass("active_edit");
				
				$(".edit_topic_"+edit_id).editable("destroy")
				$(".link_topic_"+edit_id).editable("destroy")
				
				$(".topic_link_icon_"+edit_id).toggle("show");
				$(".links_url_"+edit_id).toggle("hide");
				
				$(".edit_topic_"+edit_id).removeClass("update");
				$(".link_topic_"+edit_id).removeClass("update");
				

			}
			else
			{
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('far');
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('fas');
				$("#savebutton" + edit_type + edit_id).html(save_button)
				enableEditing(editbox);
				$("#" + editbox).attr('contenteditable', true)
				$("#" + edit_type + "_notice_" + edit_id).show("fast");			
				var delete_button = "<button type=\"button\" class=\"btn btn-danger btn-block btn-sm\"><i class=\"far fa-times-circle fa-fw\"></i></button></div>";
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('show');	
				$(".links_url_"+edit_id).toggle("show");
				$(".edit_topic_"+edit_id).addClass("update");
				$(".link_topic_"+edit_id).addClass("update");
				$(".link_topic_delete_"+edit_id).addClass("col-xl-4 col-12");
				$(".link_topic_delete_"+edit_id).html(delete_button);
				$(".link_topic_delete_"+edit_id).css("padding", "1px");
				$(this).removeClass("btn-outline-tertiary"),
				
				$(this).addClass("btn-tertiary"),
			
				$(".topic_link_icon_"+edit_id).toggle("hide");
				
				$("#topics_edit_button_"+edit_id).addClass("active_edit");
				
				
				$(".edit_topic_"+edit_id).editable({
				url: "inc/update.php",
				type: "POST",
				params: function(params)
					{ 
						var data = {};
						data["pk"] = params.pk;
						data["name"] = params.name;
						data["value"] = params.value;
						data["table"] = $(this).attr("table"); 
						return data;
					},
				emptytext: "Nichts hinterlegt",			
				success: function(data)
					{
						console.log(data);
					}			
				});
				
				$(".link_topic_"+edit_id).editable({
					// display: function(value) {
					// 	if($(this).attr("beschr")=="URL")
					// 		{
					// 			$(this).text($(this).attr("beschr"));
					// 		}
					// 	else
					// 		{
					// 			$(this).text(value);
					// 		}
					// 	} ,	
					url: baseUrl+"/inc/update.php",
				type: "POST",
				params: function(params)
					{ 
						var data = {};
						data["pk"] = params.pk;
						data["name"] = params.name;
						data["value"] = params.value;
						data["table"] = $(this).attr("table"); 
						return data;
					},
				emptytext: "Nichts hinterlegt",			
				success: function(data)
					{
						var link_id = $(this).attr("data-pk");
						$("#buttons_link_open_"+link_id).load(" #buttons_link_open_"+link_id+" > *");
						$("#buttons_link_copy_"+link_id).load(" #buttons_link_copy_"+link_id+" > *");
						console.log(data);
					}			
				});
			
			}
		}
		else
		{
			if($("#links_edit_button_"+edit_id).hasClass("active_edit"))
			{
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('fas');
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('far');
				$("#savebutton" + edit_type + edit_id).empty()
				disableEditing(editbox);
				$("#" + editbox).attr('contenteditable', false)
				$("#" + edit_type + "_notice_" + edit_id).hide("fast");			
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('show');	
				$(this).removeClass("btn-tertiary"),			
				$(this).addClass("btn-outline-tertiary"),
				
				$(".edit_link_"+edit_id).editable("destroy")
				

				
				$(".link_icon_"+edit_id).toggle("show");
				$("#links_url_"+edit_id).toggle("hide");
				
				$(".edit_link_"+edit_id).removeClass("update");
				$("#links_edit_button_"+edit_id).removeClass("active_edit");

			}
			else
			{
				$("#savebutton" + edit_type + edit_id).html(save_button)
				enableEditing(editbox);
				$("#" + editbox).attr('contenteditable', true)
				$("#" + edit_type + "_notice_" + edit_id).show("fast");			
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('show');	
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeClass('far');
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('fas');
				$(this).removeClass("btn-outline-tertiary"),
				
				$(this).addClass("btn-tertiary"),
				
				$("#links_edit_button_"+edit_id).addClass("active_edit");
				$(".edit_link_"+edit_id).addClass("update");
				
				$(".link_icon_"+edit_id).toggle("hide");
				$("#links_url_"+edit_id).toggle("show");
				
				$(".edit_link_"+edit_id).editable({
				// display: function(value) {
				// 	if($(this).attr("beschr")=="URL")
				// 		{
				// 			$(this).text($(this).attr("beschr"));
				// 		}
				// 	else
				// 		{
				// 			$(this).text(value);
				// 		}
				// 	} ,	
					url: baseUrl+"/inc/update.php",
				type: "POST",
				params: function(params)
					{ 
						var data = {};
						data["pk"] = params.pk;
						data["name"] = params.name;
						data["value"] = params.value;
						data["table"] = $(this).attr("table"); 
						return data;
					},
				emptytext: "Nichts hinterlegt",			
				success: function(data)
					{
						$("#buttons_link_open_"+edit_id).load(" #buttons_link_open_"+edit_id+" > *");
						$("#buttons_link_copy_"+edit_id).load(" #buttons_link_copy_"+edit_id+" > *");
						console.log(data);
					}			
				});
			
			}		}
		
	});


	//Nur eigene Beiträge einblenden
	if(Cookies.get("toggle_own"))
	{
		$("[own='0']").toggle("slow"); 
			$(".cat_number_all").hide();
			$(".cat_number_user").show();
			$("#edit_cat_link").addClass("edit_mode");
			$("#edit_cat_link").removeClass("fa-users");
			$("#edit_cat_link").addClass("fa-user");			
			check_sortable();

	}
	
	$("#edit_cat_link").on("click", function(){
		$("[own='0']").toggle("slow"); 
			$(".cat_number_all").toggle("fast");
			$(".cat_number_user").toggle("fast");
		if($(this).hasClass("edit_mode"))
		{
			Cookies.remove("toggle_own");	
			$(".timeline").removeClass("timeline_move");
			$("#text_test").text("");
			$(this).removeClass("fa-user");
			$(this).addClass("fa-users");					
			$(this).removeClass("edit_mode");
			$( ".kanban_sortable" ).sortable({ 
				connectWith: '',				
				});					
		}
		else
		{
			Cookies.set("toggle_own", "toggle_own");
			$.gritter.add({
				title: "OK",
				text: "Kategorienübergreifendes Verschieben möglich!",
				image: "images/confirm.png",
				time: "2000"
			});	
			$("#edit_cat_link").addClass("edit_mode");
			$("#edit_cat_link").removeClass("fa-users");
			$("#edit_cat_link").addClass("fa-user");	
			check_sortable()
		}
			
	});

	
	//Link/Beitrag löschen

	$(".delete_entry").on('click', function(){
		var pk = $(this).attr("data-pk");
		var table = $(this).attr("table");
		var option = $(this).attr("option");
		if(typeof option != 'undefined')
		{
			var cat_id = $(this).attr("cat");

			var old_anzahl_old = $("#cat_" + cat_id + "_number_user").text();							
			var old_anzahl_old_gesamt = $("#cat_" + cat_id + "_number_all").text();
	
			var new_anzahl_current = parseInt(old_anzahl_old)-1;			
			var new_anzahl_current_gesamt = parseInt(old_anzahl_old_gesamt)-1;
		}
		
		
		if(table == 'topics')
			{
				var content = 'Das Thema und alle enthaltenen Beiträge werden gelöscht!';
				if(typeof option != 'undefined')
				{
					function remove(delete_id) {$("#item-t"+pk).remove()};
				}
				else
				{
					function remove(delete_id) {$("#topics_"+pk).remove()};
				}

			}
		else
			{
				var content = 'Der Beitrag wird gelöscht!';
				if(typeof option != 'undefined')
				{
					function remove(delete_id) {$("#item-l"+pk).remove()};
				}
				else
				{
					function remove(delete_id) {$("#links_"+pk).remove()};
				}

			}
		$.confirm({
			title: 'Wirklich löschen?',
			content: content,
			type: 'red',
			buttons: {   
			ok: {
				text: "ok!",
				btnClass: 'btn-primary',
				keys: ['enter'],
				action: function(){
					jQuery.ajax({
						url: baseUrl+"/inc/delete.php?del_"+table+"=1",
						data: {	"pk":pk,
								"table":table
							},
						type: "POST",
						success:function(data){
							console.log();
							if(typeof option != 'undefined')
							{
								remove(pk);
								$("#cat_" + cat_id + "_number_user").text(new_anzahl_current);										
								$("#cat_" + cat_id + "_number_all").text(new_anzahl_current_gesamt);	
							}
							else
							{
								remove();
							}
							
							},
						error:function ()
							{
							}
						});
					}
				},
			cancel:	
				{
					text: "abbrechen!",
					action: function(){}
				}
			}
		});	
	});
							
	//Kategorien per Cookie automatisch öffnen
	var content=Cookies.get(); //get all cookies
	
	for (var panel in content){ //<-- panel is the name of the cookie
	if ($("#"+panel).hasClass("collapse-outer")) // check if this is a panel
		{
			$("div[href='#"+panel+"']").attr("aria-expanded", "true");
			$("#"+panel).addClass('collapse show');
			var cat_id = $("#"+panel).attr("id_cat");
			var angle = -90;
			$(".cat_icon_" + cat_id).attr('angle', angle);	
			$(".cat_icon_" + cat_id).css({'transform': 'rotate(' + angle + 'deg)'});				
		}  
	else if ($("#"+panel).hasClass("collapse-inner-content")) // check if this is a panel
		{
			$("#"+panel).show();
			$("#"+panel).addClass("show");	
			var test = $("#"+panel).attr("topic");	
			var angle = -90;
			$(".expand_icon_" + test).attr('angle', angle);	
			$(".expand_icon_" + test).css({'transform': 'rotate(' + angle + 'deg)'});	
		}  
	}	


	//Beim Öffnen einer Kategorie den Pfeil drehen
	$( ".load_content" ).on('click', function(){
				var cat_id = $(this).attr("category_id");
				if($(this).attr("aria-expanded") == "true")
				{
					var angle = 0;
				}
				else
				{
					var angle = -90;
				}
				$(".cat_icon_" + cat_id).attr('angle', angle);	
				$(".cat_icon_" + cat_id).css({'transform': 'rotate(' + angle + 'deg)'});		
	});

	//Alle Kategorin einklappen
	$( ".collapse_me" ).on('click', function(){
				var angle = 0;
				$(".collapse-outer").collapse("hide");
				$(".collapse-inner-content").hide("slow");
				$(".collapse-inner-content").removeClass("show");
				for (var de_panel in content){
					if(de_panel.substr(0,8) == "collapse")
					{
						Cookies.remove(de_panel);
					}
					
				$(".rotate-arrow").removeAttr('angle');	
				$(".rotate-arrow").css({'transform': ''});
			}
				
	});

	 //Alle Kategorien ausklappen
	$( ".expand_me" ).on('click', function(){
				var angle = -90;
				$(".collapse-outer").collapse('show');
				$(".cat-rotate-arrow").attr('angle', angle);	
				$(".cat-rotate-arrow").css({'transform': 'rotate(' + angle + 'deg)'});	
	}); 


	//Themenlinks aus/einklappen		
	$(".collapse-inner").on("click", function(){
		var topic_id = $(this).attr("id_topic");
		$("#collapse_topic_" + topic_id).toggle("fast");
		if ($("#collapse_topic_" + topic_id).hasClass("show"))
		{
			Cookies.remove("collapse_topic_" + topic_id);	
			var angle = 0;
			$(".expand_icon_" + topic_id).css({'transform': 'rotate(' + angle + 'deg)'});
			$(".expand_icon_" + topic_id).removeAttr('angle');	
			$("#collapse_topic_" + topic_id).removeClass("show");
		}
		else
		{
			Cookies.set("collapse_topic_" + topic_id, "topic");	
			$("#collapse_topic_" + topic_id).addClass("show");
			var angle = -90;
			$(".expand_icon_" + topic_id).attr('angle', angle);	
			$(".expand_icon_" + topic_id).css({'transform': 'rotate(' + angle + 'deg)'});
		}
			
	 });

	//Cookies der Kategorien setzen/entfernen
	$(".collapse-outer").on("show.bs.collapse", function(){
		var cat_id = $(this).attr("id");
		Cookies.set(cat_id, "category");	
	 });
	 
	$(".collapse-outer").on("hide.bs.collapse", function(){
		var cat_id_remove = $(this).attr("id");
		Cookies.remove(cat_id_remove);	
	 });


	//Export ausführen
	$("#export_list").on("click", function(){
		var order_by = $('.export_check:checked').val();
		var id_episode = $(this).attr("export_episode_id");
		$.ajax({
			url: baseUrl+"/inc/select.php?export_list=1",
			type: "POST",
			data: {	"id_episode":id_episode,
					"order_by":order_by,
				},
			success: function(data)
				{
					console.log(data);
					$("#export_result").html(data);
				},
			}); 		
	});
	
	//Anzeigenamen prüfen
	$("#Username_Show").on("change input keyup blur", function(){
		$.ajax({
			url: baseUrl+"/inc/check.php?check_edit_user_short=1",
			type: "POST",
			data: {	"name_show_edit":$("#Username_Show").val(),
					"name_show_cur":$("#Username_Show").attr("name_show_cur")
				},
			success: function(data)
				{ 
					console.log(data);
					$("#Username_Show_availability-status-new").html(data);
				}
			});
		});					

	//Profil bearbeiten
	$("#save_profile").on("click", function(){
		var user_id = $(this).attr("user_id");
		var name_show = $("#Username_Show").val();
		var email = $("#email").val();
		var password_new = $("#Password").val();
		var password_new_repeat = $("#PasswordRepeat").val();

		if($('#save_podcast').is(':checked'))
		{
			var save_podcast = 1;
		}
		else
		{
			var save_podcast = "NULL";
		}
		if($('#save_episode').is(':checked'))
		{
			var save_episode = 1;
		}
		else
		{
			var save_episode = "NULL";
		}		


		if(password_new !== password_new_repeat)
			{
				$.gritter.add({
					title: "Fehler",
					text: "Die Passwörter müssen übereinstimmen!",
					image: "images/delete.png",
					time: "1000"
					});	
				return;
			}
		$.ajax({
			url: baseUrl+"/inc/update.php?edit_user=1",
			type: "POST",
			data: {	"user_id":user_id, 
					"name_show":name_show, 
					"email":email, 
					"password_new":password_new, 
					"password_new_repeat":password_new_repeat,
					"save_podcast":save_podcast,
					"save_episode":save_episode
				},
			success: function(data)
				{
					console.log(data);
					$.gritter.add({
						title: "OK",
						text: "Dein Profil wurde gespeichert!",
						image: "images/confirm.png",
						time: "1000",
						});	
					$("#app-sidebar__user-name").load(" #app-sidebar__user-name > *");
					return;
				},
			});	
		});
		
	//Save Podcast/Episoden prüfen
	$("#save_episode").on("click", function(){
		if(!$('#save_podcast').is(':checked'))
		{
			$('#save_podcast').prop('checked', true);
		}

	});
	
 	$("#save_podcast").on("click", function(){
		if( (!$("#save_podcast").is(':checked')) && ($("#save_episode").is(':checked')) )
		{
			$('#save_episode').prop('checked', false);
		}
	}); 
	

	

	//Editable
		$.fn.editable.defaults.mode = "inline";
		$.fn.editableform.buttons = "<div class=\"row\"><div class=\"col-6\" style=\"padding-right: 1px\"><button type=\"submit\" class=\"btn btn-success editable-submit btn-block btn-sm\"><i class=\"fas fa-fw fa-check\"></i></button>" + "</div><div class=\"col-6\" style=\"padding-left: 1px\"><button type=\"button\" class=\"btn btn-danger editable-cancel btn-block btn-sm\"><i class=\"fas fa-fw fa-ban\"></i></button></div></div>" ;
	$(".update").editable({
		params: function(params)
			{ 
				var data = {};
				data["pk"] = params.pk;
				data["name"] = params.name;
				data["value"] = params.value;
				data["table"] = $(this).attr("table");
				return data;
			},
		type: "POST",
		emptytext: "Nichts hinterlegt",
		display: function(value) {
			if($(this).attr("beschr")=="URL")
				{
					$(this).text($(this).attr("beschr"));
				}
			else
				{
					$(this).text(value);
				}
			} ,					
		success: function(data)
			{
				console.log(data);
			}
	});

	//Change-Modal für Podcast/Episodenwechsel aufrufen
	$(".change").on("click", function(){
		$("#change").modal("show");
		var change_value = $(this).attr("change_value");

		$.ajax({
			url: baseUrl+"/inc/select.php?change=1",
			type: "POST",
			data: {"change_value":change_value},
			success: function(data)
				{
					console.log(data),
					$("#change_content").html(data);
				},
		});
	});	

	//Change-Modal für neue Einträge aufrufen
	$(".add_entry").on("click", function(){
		$("#change").modal("show");
		$("#exampleModalLabel").html("Erfassen");
		var change_value = $(this).attr("change_value");

		$.ajax({
			url: baseUrl+"/inc/select.php?add_entry=1",
			type: "POST",
			data: {"change_value":change_value},
			success: function(data)
				{
					console.log(data),
					$("#change_content").html(data);
				},
		});
	});	
	
	//Change-Modal für neue Einträge in der Kategorie aufrufen
	$(".add_entry_category").on("click", function(){
		$("#change").modal("show");
		$("#exampleModalLabel").html("Erfassen");
		var change_value = $(this).attr("change_value");
		var cat_id = $(this).attr("id_cat");
		var max_entries = $(this).attr("max_entries");

		$.ajax({
			url: baseUrl+"/inc/check.php?select_category=1",
			type: "POST",
			data: {"cat_id":cat_id, "change_value":change_value, "max_entries":max_entries},
			success: function(data)
				{
					console.log(data),
					$("#change_content").html(data);
				},
		});
	});	
	
	//Change-Model für Episode bereinigen aufrufen
	$(".clean_episode").on("click", function(){
		$("#change").modal("show");
		$("#exampleModalLabel").html("Episode bereinigen");
		var change_value = $(this).attr("change_value");

		$.ajax({
			url: baseUrl+"/inc/select.php?clean_episode=1",
			type: "POST",
			data: {"change_value":change_value},
			success: function(data)
				{
					console.log(data),
					$("#change_content").html(data);
				},
		});
	});	
	
	//Episode schließen
	$("#closeepisode").on("click", function(){

		var episode_close = $(this).attr('episode');
		
		$.confirm({
			boxWidth: '50%',
			useBootstrap: false,	
			title: 'Episode schließen?',
			content: '<hr style=\"margin-top:0px\"><h5>Die Episode wird geschlossen! </h5>',
			type: 'red',
			buttons: 
				{   
					ok: 
						{
							text: "ok!",
							btnClass: 'btn-primary',
							keys: ['enter'],
							action: function(){
								jQuery.ajax({
									url: "inc/update.php?close_episode=1",
									data: {"episode_close":episode_close},
									type: "POST",
									success:function(data)
										{
											console.log(data);
											location.reload();
										},
									error:function ()
										{
										}
									});
								}
						},
					cancel:	
						{
							text: "abbrechen!",
							action: function(){}
						}
				}
			});		
	});	

	//Episode öffnen
	$("#openepisode").on("click", function(){

		var episode_open = $(this).attr('episode');
	
		$.confirm({
			boxWidth: "50%",
			useBootstrap: false,
			title: "Episode wieder öffnen?",
			content: "<hr style=\"margin-top:0px\"><h5>Die Episode wird wieder geöffnet! </h5>",
			type: "red",
			buttons: 
				{   
					ok: 
						{
							text: "ok!",
							btnClass: "btn-primary",
							keys: ["enter"],
							action: function(){
							jQuery.ajax({
								url: baseUrl+"/inc/update.php?open_episode=1",
								data: {"episode_open":episode_open},
								type: "POST",
								success:function(data)
									{
										console.log(data);
										location.reload();
									},
								error:function ()
									{
									}
								});
							}
						},
					cancel:	
						{
							text: "abbrechen!",
							action: function(){}
						}

				}
			});		
	});	

});
