
(function($) {
    jQuery.fn.extend({
        uploadPreview: function(opts) {
            opts = jQuery.extend({
                width: null,    
                height: null,
                imgDiv: "#imgDiv",  
                anyTarget: null,    
                maxSize: 300,       
                imgType: ["gif", "jpeg", "jpg", "bmp", "png"],  
                callback: function() { return false; }  
            }, opts || {});
 
            var _this = $(this);
            var imgDiv = $(opts.imgDiv);
            opts.width && imgDiv.width(opts.width);
            opts.height && imgDiv.height(opts.height);
 
            var isIE = navigator.appName == 'Microsoft Internet Explorer', 
                brVersion = navigator.appVersion, version;
            isIE && (version = brVersion.split(';')[1].replace(/MSIE[ ]/g,'').replace('.0',''));
 
            handle = function() {
                var img = imgDiv.find('img');
                opts.anyTarget && $.each(opts.anyTarget.split(','), function(index, val) {
                    $(val).html(img.clone());
                });
                img.width(opts.width).height(opts.height);
                opts.callback(img);
            },
 
            createImg = function(){
                imgDiv.html('');
 
                var img = $("<img />");
                imgDiv.append(img);
                return img;
            },
 
            _this.change(function() {
 
                if (this.value) {
                    if (!RegExp("\.(" + opts.imgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        alert("图片类型必须是" + opts.imgType.join("，") + "中的一种");
                        this.value = "";
                        return false;
                    }
 
                    if (isIE && version < 10) {
 
                        if (version == 6) {
 
                            var image = new Image();
                            image.onload = function(){
                                if( (image.fileSize/1024) > opts.maxSize) {
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
                            }
                            image.src = 'file:///' + this.value;
 
                            createImg().attr('src', image.src);
                            handle();
                        }  else {
 
                            var img = document.selection.createRange().text || $(this).val();
                            var image = $('<img />')
                            image.load(function(){
                                if( (image.fileSize/1024) > opts.maxSize) {
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
                            });
                            image.attr('src', img);                           
                            imgDiv.html('');           
 
                            image.css({ filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='"+img+"')" });
                            imgDiv.append(image);
                            setTimeout(handle, 100);                            
                        }
                    }
                    else {
                        var img;
                        try{   
                            var file = null;
                            var size = 0;
                            if(this.files && this.files[0] ){
                                file = this.files[0]; 
                                size = file.size;
                            }else if(this.files && this.files.item(0)) {                                
                                file = this.files.item(0);   
                                size = file.fileSize;
                            } 
 
                            if((size/1024) > opts.maxSize){
                                alert('图片大小不能超过'+opts.maxSize+'K');
                                return false;
                            }
 
                            img = createImg();
 
                            //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
                            try{
                                //Firefox7.0 以下                             
                                img.attr('src', file.getAsDataURL());
                            }catch(e){
                                //Firefox8.0以上                              
                                img.attr('src', window.URL.createObjectURL(file));
                            }
 
                            img.css({ "vertical-align": "middle" });
                            setTimeout(handle, 100);
                        }catch(e){                          
                            //支持html5的浏览器,比如高版本的firefox、chrome、ie10
                            if (this.files && this.files[0]) {                          
                                if((this.files[0].size/1024) > opts.maxSize){
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
 
                                var reader = new FileReader(); 
                                reader.onload = function (e) {                                      
                                    imgDiv.attr('src', e.target.result);  
                                };
                                reader.readAsDataURL(this.files[0]); 
                                setTimeout(handle, 100);
                            }  
                        };
                    }
                }
            });
        }
    });
})(jQuery);
