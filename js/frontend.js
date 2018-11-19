/**
 * Jquery Custom Scripts for the frontend
 *
 * PHP Version 7.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @category  podflow!
 *
 * @author    Michael Böhmländer <info@podflow.de>
 * @copyright 2018 Michael Böhmländer
 * @license   http://www.mozilla.org/MPL/2.0/ Mozilla Public License Version 2.0
 *
 * @link      http://www.podflow.de
 * @since     2018-09-01
 */

/* //Exportreihenfolge speichern

function save_order(){
	var sortable_data = $("#list_check").sortable("serialize"); 
	console.log(sortable_data);
	$.ajax({
		url: "inc/update.php?set_order=1",
		type: "POST",
		data: sortable_data,
		success: function(data)
			{
				console.log(data);
				$("#export_out").load(" #export_out > *");
			},
		});  
} */	

//Kanbanreihenfolge speichern

function save_order_kanban(id_cat){
	var sortable_data = $("#"+id_cat).sortable("serialize"); 
	console.log(sortable_data);
	$.ajax({
		url: "inc/update.php?set_order=1",
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
	$("#check_"+id).blur();
	var check_icon = "<i class='far fa-check-circle'></i>";
	if ($("#check_"+table+id).attr("data-checked") == "1")
		{
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
		url: "inc/update.php?update_links=1",
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
	
	$(".edit_entry").on("click", function(){
		var edit_id = $(this).attr("edit_id");
		var edit_type = $(this).attr("edit_type");
		if(edit_type == "topics")
		{
			if($("#topics_edit_button_"+edit_id).hasClass("active_edit"))
			{
				var angle = 0;
				$("#" + edit_type + "_notice_" + edit_id).hide("fast");			
				$("#notice_toggle_"+edit_type+"_"+edit_id).css({'transform': 'rotate(' + angle + 'deg)'});
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeAttr('angle');	
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
				$("#" + edit_type + "_notice_" + edit_id).show("fast");			
				var delete_button = "<button type=\"button\" class=\"btn btn-danger btn-block btn-sm\"><i class=\"far fa-times-circle fa-fw\"></i></button></div>";
				var angle = 90;
				$("#notice_toggle_"+edit_type+"_"+edit_id).attr('angle', angle);	
				$("#notice_toggle_"+edit_type+"_"+edit_id).css({'transform': 'rotate(' + angle + 'deg)'});
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
				$("#" + edit_type + "_notice_" + edit_id).hide("fast");			
				var angle = 0;
				$("#notice_toggle_"+edit_type+"_"+edit_id).css({'transform': 'rotate(' + angle + 'deg)'});
				$("#notice_toggle_"+edit_type+"_"+edit_id).removeAttr('angle');	
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
				$("#" + edit_type + "_notice_" + edit_id).show("fast");			
				var angle = 90;
				$("#notice_toggle_"+edit_type+"_"+edit_id).addClass('show');	
				$("#notice_toggle_"+edit_type+"_"+edit_id).attr('angle', angle);	
				$("#notice_toggle_"+edit_type+"_"+edit_id).css({'transform': 'rotate(' + angle + 'deg)'});
				$(this).removeClass("btn-outline-tertiary"),
				
				$(this).addClass("btn-tertiary"),
				
				$("#links_edit_button_"+edit_id).addClass("active_edit");
				$(".edit_link_"+edit_id).addClass("update");
				
				$(".link_icon_"+edit_id).toggle("hide");
				$("#links_url_"+edit_id).toggle("show");
				
				$(".edit_link_"+edit_id).editable({
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
						$("#buttons_link_open_"+edit_id).load(" #buttons_link_open_"+edit_id+" > *");
						$("#buttons_link_copy_"+edit_id).load(" #buttons_link_copy_"+edit_id+" > *");
						console.log(data);
					}			
				});
			
			}		}
		
	});
	
	//Link/Beitrag löschen

	$(".delete_entry").on('click', function(){
		var pk = $(this).attr("data-pk");
		var table = $(this).attr("table");
		var option = $(this).attr("option");

		if(table == 'topics')
			{
				var content = 'Das Thema und alle enthaltenen Beiträge werden gelöscht!';
				function remove(delete_id) {$("#topic_"+pk).remove()};
			}
		else
			{
				var content = 'Der Beitrag wird gelöscht!';
				function remove(delete_id) {$("#link_"+pk).remove()};
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
						url: "inc/delete.php?del_"+option+"=1",
						data: {	"pk":pk,
								"table":table
							},
						type: "POST",
						success:function(data){
							console.log(data);
							remove(pk);
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
			$("#"+panel).collapse();
			var cat_id = $("#"+panel).attr("id_cat");
			var angle = 90;
			$(".cat_icon_" + cat_id).attr('angle', angle);	
			$(".cat_icon_" + cat_id).css({'transform': 'rotate(' + angle + 'deg)'});				
		}  
	else if ($("#"+panel).hasClass("collapse-inner-content")) // check if this is a panel
		{
			$("#"+panel).show();
			$("#"+panel).addClass("show");	
			var test = $("#"+panel).attr("topic");	
			var angle = 90;
			$(".expand_icon_" + test).attr('angle', angle);	
			$(".expand_icon_" + test).css({'transform': 'rotate(' + angle + 'deg)'});	
		}  
	}	

console.log(content);

$( ".load_content" ).on('click', function(){
			var cat_id = $(this).attr("category_id");
			if($(this).attr("aria-expanded") == "true")
			{
				var angle = 0;
			}
			else
			{
				var angle = 90;
			}
			$(".cat_icon_" + cat_id).attr('angle', angle);	
			$(".cat_icon_" + cat_id).css({'transform': 'rotate(' + angle + 'deg)'});		
});
$( ".collapse_me" ).on('click', function(){
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
$( ".expand_me" ).on('click', function(){
			$(".collapse-outer").collapse('show');
});
			
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
		var angle = 90;
		$(".expand_icon_" + topic_id).attr('angle', angle);	
		$(".expand_icon_" + topic_id).css({'transform': 'rotate(' + angle + 'deg)'});
	}
		
 });
 
$(".collapse-outer").on("show.bs.collapse", function(){
	var cat_id = $(this).attr("id");
 	Cookies.set(cat_id, "category");	
 });
 
$(".collapse-outer").on("hide.bs.collapse", function(){
	var cat_id_remove = $(this).attr("id");
 	Cookies.remove(cat_id_remove);	
 });


/* 	//Themen/Beiträge ordnen für den Export
	if ($("#list_check").has("li").length === 0)
		{
			$("#btn-save").attr("disabled", true);
		} */
		
/* 	//Themen/Beiträge in die Exportliste hinzufügen
	$(function  (){
		$("#list_uncheck").sortable({
			connectWith: ".sortcheck",
			remove: function( event, ui ){
				$("#btn-save").removeAttr("disabled");
				var pk = ui.item.attr("data-pk");
				var name = $(this).attr("data-name");
				var table = ui.item.attr("table");
				$.ajax({
					url: "inc/update.php?update_links=1",
					type: "POST",
					data: {	"name":name, 
							"pk":pk, "value":1, 
							"table":table 
						},
					success: function(data)
						{
							console.log(data);
						},
					}); 
				}

			});
		});	
		
	//Themen/Beiträge aus der Exportliste entfernen
	$(function  (){
		$("#list_check").sortable({
		remove: function( event, ui ) {
		var pk = ui.item.attr("data-pk");
		var name = $(this).attr("data-name");
		var table = ui.item.attr("table");
		$.ajax({
			url: "inc/update.php?update_links=1",
			type: "POST",
			data: {	"name":name, 
					"pk":pk, 
					"value":0, 
					"table":table, 
					"order":0 
				},
			success: function(data)
				{
					console.log(data);
					$("#export_out").load(" #export_out > *");
				},
			}); 
		},
		update: function( event, ui){
			if ($("#list_check").has("li").length !== 0)
				{
					save_order();
				}
			},		
		create: function( event, ui){
			if ($("#list_check").has("li").length !== 0)
				{
				}
			}
		});
	});	 */	

	//Export ausführen
	$("#export_list").on("click", function(){
		var id_episode = $(this).attr("export_episode_id");
		$.ajax({
			url: "inc/select.php?export_list=1",
			type: "POST",
			data: {	"id_episode":id_episode, 
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
			url: "inc/check.php?check_edit_user_short=1",
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
			url: "inc/update.php?edit_user=1",
			type: "POST",
			data: {	"user_id":user_id, 
					"name_show":name_show, 
					"email":email, 
					"password_new":password_new, 
					"password_new_repeat":password_new_repeat
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

/* 	//Beiträge verschieben
	$(".update_cat").change(function(){
		var pk = $(this).attr("data-pk")
		var name = $(this).attr("data-name")
		var table = $(this).attr("table")
		var value = $(this).val()
		$.ajax({
			url: "inc/update.php",
			type: "POST",
			data: {	"name":name, 
					"pk":pk, 
					"value":value, 
					"table":table
				},
			success: function(data)
				{
					console.log(data);
					location.reload();
				},
		});
	});	 */

/* 	//Meine Beiträge --> Geöffnetes Tab im lokalen Speicher belassen und Öffnen
	$("a[data-toggle='pill']").on('show.bs.tab', function(e) {
		localStorage.setItem('activeTab', $(e.target).attr('href'));
	});
	
	var activeTab = localStorage.getItem('activeTab');
	if(activeTab)
		{
			$('#pills-tab a[href=\"' + activeTab + '\"]').tab('show');
		} */

	//Change-Modal für Podcast/Episodenwechsel aufrufen
	$(".change").on("click", function(){
		$("#change").modal("show");
		var change_value = $(this).attr("change_value");

		$.ajax({
			url: "inc/select.php?change=1",
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
			url: "inc/select.php?add_entry=1",
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
			url: "inc/check.php?select_category=1",
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
			url: "inc/select.php?clean_episode=1",
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
								url: "inc/update.php?open_episode=1",
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
