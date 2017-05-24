$(document).ready(function(){
	        var final_files_to_upload = [];

            /* Add files to array without duplication*/
            $('.fileUpload').change(function(){

                $('.filesTable').show();
                $('#upload-button').show();
                var file_names = [];
                var files = $('.filesToUpload')[0].files;
                if(!(final_files_to_upload.length > 0)){

                  $.each(files, function(index, value){
                        final_files_to_upload.push(value);
                        $('#file-table').append("<tr id='delete_data'><td>"+value.name+"</td><td><a><span class='pe-7s-trash'></span></a></td></tr>");                      
                  });  
                }

                else{
                    for(var i=0; i<final_files_to_upload.length; i++){
                        file_names.push(final_files_to_upload[i].name);
                    }

                    for(var i=0; i<files.length; i++){
                        if ($.inArray(files[i].name, file_names) == -1){
                            final_files_to_upload.push(files[i]);
                           $('#file-table').append("<tr id='delete_data'><td>"+files[i].name+"</td><td><a><span class='pe-7s-trash'></span></a></td></tr>");  
                        }
                    }
                }

                /* Show columns by id_merging in segment creation*/
                var td = $('#file-table').children('tr').children('td').length;
                if(td > 2){
                   $('#columns_to_merge').show(); 
                }


            });

            /* Deleting files from array */

            $('.filesTable').on('click', '#delete_data', function(){

                /* Hide columns by id_merging in segment creation*/
                var td = $('#file-table').children('tr').children('td').length;
                if(td <= 4){
                   $('#columns_to_merge').hide(); 
                }

                var removed_files = $(this).context.textContent;
                var initial_files = $('.filesToUpload')[0].files;

                /* Check if the file is in the final list and remove it */
                if(final_files_to_upload.length > 0){
                    for(var i=0; i<final_files_to_upload.length; i++){
                        if(removed_files == final_files_to_upload[i].name){
                            final_files_to_upload.splice(i, 1);
                            
                        }
                    }
                }

                $(this).remove();

                /* Remove the upload button and table if files to upload array is empty*/
                if(final_files_to_upload.length == 0){
                    $('.filesTable').hide();
                    $('#upload-button').hide();
                }

                });
                
          

            /* Submitting multiple files */

            $('#fileUpload').submit(function(e){
                e.preventDefault();

                var allowed_files = ['csv', 'xls']
                files = new FormData();
                for(var i=0; i<final_files_to_upload.length; i++){
                    if ($.inArray((final_files_to_upload[i].name).split('.').pop(), allowed_files) == -1){
                    	files.length = 0;
                    	swal({
                    		title: "Unsupported file type",
  							text: "The file  "+final_files_to_upload[i].name+" is not supported",
  							type: "warning",
                    	});
                    }
                    else{
                    	files.append("key", final_files_to_upload[i]);
                    }

                }

                if(files.length != 0){
                    files.append('columns_to_merge', $('#colums_merge').val());
                    files.append('segment_name', $('#segment_name').val());


                    /* check page */
                    if($('.createSegment')[0] != undefined){
                         var $segment = $('#SegmentLoader'), $that = $(this);
                        $that.closest('.col-md-12').append('<div class="loading"></div>');

                        $.ajax({
                            method: 'POST',
                            url: "fileUpload/",
                            data: files,
                            contentType: false,
                            processData: false,
                        }).done(function(data) {
                            $that.closest('.col-md-12').find('.loading').remove();
                            if(data.fail){
                                swal({
                                    title: "Error",
                                    text: "Segment already exists. Please use a different segment name",
                                    type: "warning",
                                })
                            }

                            if(data.rs){
                                parsed_json = JSON.parse(data.rs);
                                /* th*/
                                th = '';
                                headers = Object.keys(parsed_json[0]);
                                for(var i=0; i<headers.length; i++){
                                    th += '<th>'+headers[i]+'</th>';
                                }

                                /* tr */
                                tr = '';
                                td = '';
                                for(var key in parsed_json){  
                                    values = Object.values(parsed_json[key])

                                    for(var i=0; i<values.length; i++){
                                        td += '<td>'+values[i]+'</td>';
                                    }
                                    tr += '<tr>'+td+'</tr>';

                                }

                                /* Append to table */
                                $('.stepDescription').html('Step 2');
                                $('.segmentDescrition').html('Summary of your files. This is just a summary of your files ');
                                $('#segmentStep1').html('<table class="table table-hover table-striped"><thead>'+th+'</thead><tbody>'+tr+'</tbody></table>');
                                $('.footerSegment').show();

                                
                            }

                        }).complete(function(){
                $that.closest('.col-md-12').find('.loading').remove();
            });;
                    }

                    if($('.createProfile')[0] != undefined){

                        var $segment = $('#customerProfileContent'), $that = $(this);
                        $that.closest('.col-md-8').append('<div class="loading"></div>');

                        $.ajax({
                            method: 'POST',
                            url: "/CustomerUpload/",
                            data: files,
                            contentType: false,
                            processData: false,
                        }).done(function(data) {
                            swal({
                                title: "Success",
                                text: "Customer Profile Data uploaded successfully",
                                type: "success",
                                closeOnConfirm: false,
                            },
                            function(isConfirm){
                            if(isConfirm){
                                location.reload();
                            }
                        }).complete(function(){
                $that.closest('.col-md-8').find('.loading').remove();
            });;


                        }).error(function(data){
                            swal({
                                title: "Error",
                                text: "Customer Profile Data doesn't have the columns required",
                                type: "warning",
                            })

                             $that.closest('.col-md-8').find('.loading').remove();
                        });
                    }

                }

            });


});