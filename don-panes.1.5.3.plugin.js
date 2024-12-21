/*
    don-panes
    by gdpickett

    Thanks Patrice and Avidgamer

              //---------------------------------------------------------------------------------------------------------------------------------------
            //
            //
            //Make similarx2 Button goes up to 10 images, but, uses user steps and parallel settings
            //
            // 
            // Find icon for collapse panels 8/7 Complete
            // Added red and green color to icons 8/7 Complete
            // Make similar button on main panel image 8/7 Complete
            // Make all open panels collapse, opens only the panels it closed and newer panels will be collapsed when active Complete
            // Save to local for mobile 8/8 Complete
            // Change color and add number of images to panes loading panes -- mod
            // Added color to simx2 and fav panels and borders 8/11 Complete
            // 
            // Update 1.5.3
            // Added a panel to adjust Prompt, Negative Prompt, Number of Images, in Parallel, Inference Guidance and Prompt Strength when using
            // Make Similar Images x 2 button
            //
            //---------------------------------------------------------------------------------------------------------------------------------------

*/
(function () {
    "use strict"

    // default timeout settings
    const HIDE_TOOLBAR_TIMER = 4000;

    var styleSheet = document.createElement("style")
    styleSheet.textContent = `
        .similarx2 {
            border-bottom-color: olive;
        }
        .similarx2Panel {
            background: darkblue;
        }
        .favorite {
            border-bottom-color: crimson;     
        }
        .favoritePanel {
            background: olive;
        }

        .similarx2TextArea {
            min-width: -webkit-fill-available;
            width: -moz-available;
        }

        @media (min-width: 700px) {
            body {
                overflow-y: hidden;
            }
            
            #top-nav {
                position: fixed;
                background: var(--background-color4);
                display: flex;
                width: 100%;
                z-index: 10;
            }

            #editor {
                z-index: 1;
                width: min-content;
                min-width: 380pt;
                position: fixed;
                overflow-x: hidden;
                overflow-y: auto;
                top: 0;
                bottom: 0;
                left: 0;
            }
            /*
            #paneToggleContainer:hover + #editor {
                transition: 0.25s;
            }
            */
            
            #save-settings-config > DIV {
                max-height: 90vh;
                overflow-x: hidden;
                overflow-y: auto;
            }
            #save-settings-config > DIV::-webkit-scrollbar-thumb {
                background: var(--background-color1);
            }
            #save-settings-config > DIV::-moz-scrollbar-thumb {
                background: var(--background-color1);
            }
        
            #preview {
                position:  fixed;
                overflow-y: auto;
                top: 0;
                bottom: 0;
                left: 0;
                right:0;
                padding: 0 16px 0 16px;
                outline: none;
            }
            /*
            #paneToggle:hover ~ #preview {
                transition: 0.25s;
            }
            */
    
            #preview-tools {
                background: var(--background-color1);
                position: sticky;
                top: -100px; /* hide the toolbar by default */
                transition: 0.25s;
                z-index: 1;
                padding: 10px 10px 10px 10px;
                /*
                -webkit-mask-image: linear-gradient(to bottom, black 0%, black 90%, transparent 100%);
                mask-image: linear-gradient(to bottom, black 0%, black 90%, transparent 100%);
                */
                opacity: 90%;
            }
        
            #editor-modifiers {
                overflow-y: initial;
                overflow-x: initial;
            }
            
            .image_preview_container {
                padding: 6px;
            }

            /* pane toggle */
            #paneToggleContainer {
                width: 8px;
                top: 0;
                left: 0;
                background: var(--background-color1);
                margin: 0;
                border-radius: 5px;
                position: fixed;
                z-index: 1000;
            }
            
            #paneToggle {
                width: 8px;
                height: 100px;
                left: 0;
                background: var(--background-color2);
                margin: 0;
                border-radius: 5px;
                position: relative;
                top: 50%;
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
            }
            
            .arrow-right {
                width: 0; 
                height: 0; 
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                border-left: 8px solid var(--accent-color);
                
                margin: 0;
                position: absolute;
                top: 50%;
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
            }
            
            .arrow-left {
                width: 0; 
                height: 0; 
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent; 
                border-right:8px solid var(--accent-color);
                
                margin: 0;
                position: absolute;
                top: 50%;
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
            }
            
            .popup {
                position: fixed;
            }
            
            .model-list {
                width: 100%;
                width: -moz-available;          /* WebKit-based browsers will ignore this. */
                width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
                width: fill-available;
            }
        }

        @media (max-width: 700px) {
            #hidden-top-nav {
                display: none;
            }
        }

        /* STICKY FOOTER */
        #preview {
            display: flex;
            flex-direction: column;
        }
        #preview-content {
            flex: 1 0 auto;
        }
        #footer {
            padding-left: 4px;
            flex-shrink: 0;
        }

        /* SCROLLBARS */
        :root {
            --scrollbar-width: 12px;
            --scrollbar-radius: 10px;
        }
        
        .scrollbar-preview::-webkit-scrollbar {
            width: var(--scrollbar-width);
        }
        
        .scrollbar-preview::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px var(--input-border-color);
            border-radius: var(--input-border-radius);
        }
        
        .scrollbar-preview::-webkit-scrollbar-thumb {
            background: var(--background-color2);
            border-radius: var(--scrollbar-radius);
        }
        
        ::-webkit-scrollbar {
            width: var(--scrollbar-width);
        }
        
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px var(--input-border-color);
            border-radius: var(--input-border-radius);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--background-color2);
            border-radius: var(--scrollbar-radius);
        }
        
        .scrollbar-preview::-moz-scrollbar {
            width: var(--scrollbar-width);
        }
        
        .scrollbar-preview::-moz-scrollbar-track {
            box-shadow: inset 0 0 5px var(--input-border-color);
            border-radius: var(--input-border-radius);
        }
        
        .scrollbar-preview::-moz-scrollbar-thumb {
            background: var(--background-color2);
            border-radius: var(--scrollbar-radius);
        }
        
        ::-moz-scrollbar {
            width: var(--scrollbar-width);
        }
        
        ::-moz-scrollbar-track {
            box-shadow: inset 0 0 5px var(--input-border-color);
            border-radius: var(--input-border-radius);
        }
        
        ::-moz-scrollbar-thumb {
            background: var(--background-color2);
            border-radius: var(--scrollbar-radius);
        }
    `
    document.head.appendChild(styleSheet)

    const topNavbar = document.querySelector('#top-nav')
    const tabContainer = document.querySelector('#tab-container')
    const footerPane = document.querySelector('#footer')
    document.querySelector('#preview').appendChild(footerPane)

    // create a placeholder header hidden behind the fixed header to push regular tab's content down in place
    const hiddenHeader = document.createElement('div')
    topNavbar.parentNode.insertBefore(hiddenHeader, topNavbar.nextSibling)
    hiddenHeader.id = 'hidden-top-nav'
    hiddenHeader.position = 'absolute'
    hiddenHeader.style.width = '100%'


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const donTab = document.createElement('span');
    donTab.id = 'tab-don';
    const donSpan = document.createElement('span');
    const donIcon = document.createElement('i');
    donIcon.classList.add('fa', 'icon', 'fa-shop-lock');
    donSpan.innerText = 'Collapse Panes';
    donSpan.prepend(donIcon);
    donTab.appendChild(donSpan);
    donTab.classList.add('tab');
    console.info(donSpan);

    let refPanes;
    let oldPanes;

    const promptStrOrg = document.getElementById('prompt_strength');
    promptStrOrg.step = '0.01';
    promptStrOrg.type = 'number';
    promptStrOrg.inputMode = '';

    const guidanceScale = document.getElementById('guidance_scale');
    guidanceScale.step = '0.05';
    guidanceScale.type = 'number';
    guidanceScale.inputMode = '';

    function addBuildOptions() {
        console.log('Add Don Panes Settings');
        var openCheck2 = '';
        //openCheck2 = ' active';
        var BuildSettings = document.createElement('div');
        BuildSettings.id = 'donPanes-settings';
        BuildSettings.classList.add('panel-box');
        const h4 = document.createElement('h4');
        h4.classList.add('collapsible');
        h4.textContent = 'Don Panes Settings';
        BuildSettings.appendChild(h4);

        const basSettings = document.createElement('div');
        basSettings.id = "bas-settings-entries";
        basSettings.classList.add('collapsible-content');
        basSettings.style = "display: block;margin-top:15px;";

        const settingsHeader = document.createElement('b');
        settingsHeader.classList.add('settings-subheader', 'mb-5');
        settingsHeader.textContent = 'Similar x 2';
        basSettings.appendChild(settingsHeader);

        BuildSettings.appendChild(basSettings);

        let tempHTML = `
			<h4 class="collapsible `+ openCheck2 + `">Don Panes Settings</h4>
			<div id="bas-settings-entries" class="collapsible-content" style="display: block;margin-top:15px;">
				<label class="settings-subheader mb-5" for="similarx2"><b>Similar x 2</b> <button id="similarCopy"><i class="fa-solid fa-copy"></i></button></label>

                <div id="prompt-toolbar" class="split-toolbar">
                <div id="prompt-toolbar-left" class="toolbar-left">
                    <label for="prompt"><b>Enter Prompt</b>
                        <i class="fa-solid fa-circle-question help-btn"><span class="simple-tooltip right">
                            You can type your prompts in the below textbox or load them from a file. You can also
                            reload tasks from metadata embedded in PNG, WEBP and JPEG images (enable embedding from the Settings).
                        </span></i>
                    </label>
                </div>
            </div>
            <textarea id="similar_prompt" class="col-free similarx2TextArea" rows="4" onchange="change(simPrompt)">a photograph of a bear riding a dog</textarea>
            <label for="negative_prompt" class="collapsible" id="negative_prompt_handle"><span class="collapsible-handle"></span>
            Negative Prompt <small>(optional)</small>
            </label>
            <div class="collapsible-content" style="display: none;">
                <textarea id="similar_negative_prompt" class="similarx2TextArea" name="negative_prompt" rows="4" onchange="change(simNegPrompt)" placeholder="list the things to remove from the image (e.g. fog, green)"></textarea>
            </div>
        
                <table>
				<tr class="pl-5"><td><label for="num_outputs_total">Number of Images:</label></td>
                        <td><input id="similar_num_outputs_total" name="num_outputs_total" value="1" style="width: 42pt" type="number" min="1" step="1" onkeypress="preventNonNumericalInput(event)" inputmode="numeric">
                        <label><small>(total)</small></label>
                        <input id="similar_num_outputs_parallel" name="num_outputs_parallel" value="1" style="width: 42pt" type="number" min="1" step="1" onkeypress="preventNonNumericalInput(event)" inputmode="numeric">
                        <label id="num_outputs_parallel_label" for="num_outputs_parallel"><small>(in parallel)</small></label></td></tr>
                <tr class="pl-5"><td><label for="num_inference_steps">Inference Steps:</label></td><td> <input id="similar_num_inference_steps" name="num_inference_steps" type="number" min="1" step="1" style="width: 42pt" value="15" onkeypress="preventNonNumericalInput(event)" inputmode="numeric"></td></tr>
                <tr class="pl-5"><td><label for="guidance_scale_slider">Guidance Scale:</label></td><td> <input id="similar_guidance_scale_slider" name="guidance_scale_slider" class="editor-slider" value="7.5" type="range" min="0" max="50"> <input id="guidance_similarx2_scale" name="guidance_similarx2_scale" size="4" value="7.5" pattern="^[0-9\.]+$" onkeypress="preventNonNumericalInput(event)" inputmode="" step="0.05" type="number"></td></tr>
                <tr id="prompt_container" class="pl-5"><td><label for="prompt_slider">Prompt Strength:</label></td><td> <input id="similar_prompt_slider" name="prompt_strength_slider" class="editor-slider" value="0.8" type="range" min="0" max="0.99" step="0.01"> <input id="prompt_similarx2_strength" name="prompt_similarx2_strength" size="4" value="0.8" pattern="^[0-9\.]+$" onkeypress="preventNonNumericalInput(event)" inputmode="" step="0.01" type="number"><br></td></tr>
				<p></p>
                </table>
			</div>
			`;
        BuildSettings.innerHTML = tempHTML;

        var editorSettings = document.getElementById('editor-settings');
        editorSettings.parentNode.insertBefore(BuildSettings, editorSettings.nextSibling);
        createCollapsibles(BuildSettings);
    }

    function updateGuidanceScale() {
        guidanceScaleField.value = guidanceScaleSlider.value / 10
        guidanceScaleField.dispatchEvent(new Event("change"))
    }

    addBuildOptions();

    const handleCollapse = () => {
        //ref is All Panes
        refPanes = document.getElementsByClassName('imageTaskContainer').length > 0 ? document.getElementsByClassName('imageTaskContainer') : [];
        refPanes = [...refPanes];
        var saver = [];
        if (document.getElementById('preview-content')) {
            const imgItemInfo = document.getElementsByClassName('imgItemInfo')[0].children;
            const imgSimilarButton = imgItemInfo[4];
            const initImageArray = document.getElementsByClassName("task-fs-initimage");

            for (let a = 0; a < initImageArray.length; a++) {
                let tooltipBar = initImageArray[a].lastElementChild;
                let br0 = document.createElement('br');
                let br1 = document.createElement('br');
                let similar = document.createElement('button');
                similar.classList.add('taskBtns');
                similar.textContent = 'Make Similar Images';
                let moreSimilar = document.createElement('button');
                moreSimilar.addEventListener('click', onMakeSimilarx2Click);
                moreSimilar.classList.add('taskBtns');
                moreSimilar.textContent = 'Make Similar Images x 2';
                if (tooltipBar.children.length < 6) {
                    tooltipBar.append(br1);
                    tooltipBar.append(moreSimilar);
                }
            }

            if (refPanes.length > 0) {
                refPanes.map((noun, index) => {
                    if (noun.firstElementChild.classList.contains('active')) {
                        noun.firstElementChild.classList.toggle('active');
                        donIcon.style.color = 'green';
                        saver.push(noun.firstElementChild);
                    }
                })

                let a = 'Look';

                if (saver.length > 0) {
                    oldPanes = saver;
                } else if (oldPanes && oldPanes.length > 0) {
                    oldPanes.forEach((noun, index) => {
                        if (noun) {
                            noun.classList.toggle('active');
                            donIcon.style.color = 'red';
                        }

                    })
                }
            }
        }

    }

    donTab.addEventListener('click', handleCollapse);
    tabContainer.appendChild(donTab);

    const favorites_loadDate = Date.now();  //load date as soon as possible, to closely match the folder date

    const suLabel = 'Favorites';  //base label prefix
    PLUGINS['IMAGE_INFO_BUTTONS'].push([
        { text: "Make Similar Images x 2", on_click: onMakeSimilarx2Click, filter: onMakeSimilarx2Filter }
    ]);

    //Model needs to have "turbo" in the filename to be recognized as a turbo model.
    function isModelTurbo(modelName, loraList) {
        if (modelName.search(/turbo/i) >= 0) {
            return true;
        }
        //if either of the first two Loras contains "lcm", assume turbo lora -- fewer steps needed
        if (loraList != undefined) {
            if (loraList[0].length > 1) { //it's an array of strings >1
                if (loraList.some(element => element.search(/lcm/i) >= 0))
                    return true;
            }
            else {  //it's a string
                if (loraList.search(/lcm/i) >= 0)
                    return true;
            }
        }
        return false;
    }

    const similarNumInputGuidance = document.getElementById('similar_guidance_scale_slider');
    const similarSliderInputGuidance = document.getElementById('guidance_similarx2_scale');
    const similarPromptSlider = document.getElementById('similar_prompt_slider');
    const similarPromptNumInput = document.getElementById('prompt_similarx2_strength');
    

    ///Bind slider and numerical values
    similarNumInputGuidance.addEventListener("input", function () {
        similarSliderInputGuidance.value = this.value;
    });

    similarSliderInputGuidance.addEventListener("input", function () {
        similarNumInputGuidance.value = this.value;
    });

    similarPromptSlider.addEventListener("input", function() {
        similarPromptNumInput.value = this.value;
    });

    similarPromptNumInput.addEventListener("input", function() {
        similarPromptSlider.value = this.value;
    });


    function onMakeSimilarx2Click(origRequest, image) {
        console.log('origRequest', origRequest['seed']);
        console.log('donPanes-settings siminlar');

        
        const similarPrompt = document.getElementById('similar_prompt').value;
        const similarPromptTest = document.getElementById('similar_prompt');
        const similarNegativePrompt = document.getElementById('similar_negative_prompt').value;
        const similarImageTotal = document.getElementById('similar_num_outputs_total').value;
        const similarParallel = document.getElementById('similar_num_outputs_parallel').value;
        const similarInference = document.getElementById('similar_num_inference_steps').value;
        
        var isTurbo;
        if (!isNaN(origRequest['seed'])) {
        //if(origRequest){
            console.warn("Checking origRequest", origRequest, image);
            //     isTurbo = isModelTurbo(origRequest.use_stable_diffusion_model, origRequest.use_lora_model);
        } else {
            console.log("Similar", origRequest, targetDimensions, targetImage);
            //Working but minor error on mobile is 
        }

        const origTarget = origRequest;
        const targetImage = image;
        const parent = targetImage.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        const targetPrompt = similarPrompt ? similarPrompt : document.getElementById('prompt').value ;    
        const immediateParent = parent.firstElementChild;
        const taskConfig = immediateParent.children[6];
        const targetSeed = parseInt(immediateParent.lastElementChild.innerText);
        //const targetDimensions = immediateParent.nextElementSibling.lastElementChild.innerText;
        const targetDimensions = [document.getElementById('image-size-options').firstElementChild.value,document.getElementById('image-size-options').children[3].value];
        //const targetSampler = taskConfig.firstElementChild?.children[2].lastElementChild.innerText;
        const targetSampler = document.getElementById('sampler_name').value
        console.info(immediateParent, targetPrompt, taskConfig, targetSampler)   
        const targetInference = document.getElementById("similar_num_inference_steps").value;
        //const targetGuidance = similarNumInputGuidance.value;
        const targetGuidance = document.getElementById('guidance_similarx2_scale').value;
        const targetModel = taskConfig.lastElementChild.children[5].lastElementChild.innerText;
        const targetNegPrompt = similarNegativePrompt ? similarNegativePrompt : document.getElementById('negative_prompt').value;
        const targetChildren = taskConfig.lastElementChild.children.length;
        const targetPromptStrength = document.getElementById('prompt_similarx2_strength').value;

        //////// Element numbers change if depending on if there is a preview or not
        let targetFaces;
        let targetLoraModel;
        let targetLoraStrength;

        switch(targetChildren){
            case 9:
                targetFaces =taskConfig.lastElementChild.children[6].lastElementChild.innerText;
                targetLoraModel = taskConfig.lastElementChild.children[7].lastElementChild.innerText;
                targetLoraStrength = taskConfig.lastElementChild.children[8].lastElementChild.innerText;
                break;
            case 10:
                targetFaces = taskConfig.lastElementChild.children[7].lastElementChild.innerText;
                targetLoraModel = taskConfig.lastElementChild.children[8].lastElementChild.innerText;
                targetLoraStrength = taskConfig.lastElementChild.children[9].lastElementChild.innerText;
                break;
            case 11:
                targetFaces = taskConfig.lastElementChild.children[8].lastElementChild.innerText;
                targetLoraModel = taskConfig.lastElementChild.children[9].lastElementChild.innerText;
                targetLoraStrength = taskConfig.lastElementChild.children[10].lastElementChild.innerText;
                break;
        }

        const diskPath = document.getElementById('diskPath').value;
        const vram = document.getElementById('vram_usage_level').value;
        //console.info("targetFaces",targetFaces,"targetLoraModel",targetLoraModel,"targetLoraStrength",targetLoraStrength,"targetChildren",targetChildren, "similarPromptTest",similarPromptTest)
        let splitLora = targetLoraModel.split(',');
        //const splitLoraAlpha = targetLoraStrength.split(',');
        let splitLoraAlpha = targetLoraStrength.split(',');
        splitLoraAlpha.forEach((element)=> parseFloat(element));


        origRequest = {
            prompt: targetPrompt,
            //prompt_strength: targetPromptStrength,
            negative_prompt: targetNegPrompt,
            //guidance_Scale: targetGuidance,
            width: parseInt(targetDimensions[0]),
            height: parseInt(targetDimensions[1]),
            vram_usage_level: vram,
            sampler: targetSampler,
            use_stable_diffusion_model: targetModel,
            clip_skip: false,
            use_vae_model: "",
            num_inference_steps: document.getElementById('similar_num_inference_steps').value,
            stream_progress_updates: true,
            stream_image_progress: false,
            show_only_filtered_image: true,
            block_nsfw: false,
            output_format: "png",
            output_quality: 95,
            output_lossless: false,
            metadata_output_format: "json",
            original_prompt: targetPrompt,
            active_tags: [],
            inactive_tags: [],
            save_to_disk_path: diskPath,
            use_face_correction: targetFaces,
            use_lora_model: splitLora,
            lora_alpha: splitLoraAlpha,
            enable_vae_tiling: true
        }

        image = targetImage;

        const newTaskRequest = modifyCurrentRequest(origRequest, {
            num_outputs: parseInt(similarParallel),
            // For Turbo, 22 steps is OK, but noticeable improvement at 30. Larger resolutions show defects/duplication.
            num_inference_steps: Math.min(targetInference, 60),  //large resolutions combined with large steps can cause an error
            prompt_strength: parseFloat(targetPromptStrength),
            init_image: image.src,
            seed: Math.floor(Math.random() * 10000000),
            num_outputs_parallel: parseInt(similarParallel),
        })

        //console.log("Lora stuff", targetLoraStrength,"Guidance",targetGuidance, "Target Children",targetChildren,"similarPrompt",document.getElementById('similar_prompt'));

        //origRequest = {};
        
        newTaskRequest.numOutputsTotal = parseInt( document.getElementById('similar_num_outputs_total').value);
        newTaskRequest.batchCount = Math.ceil(newTaskRequest.numOutputsTotal / document.getElementById('similar_num_outputs_parallel').value);
        //console.info('Par Outputs', newTaskRequest.batchCount, document.getElementById('similar_num_outputs_parallel').value, newTaskRequest, similarParallel, similarImageTotal);

        newTaskRequest.reqBody.guidance_scale = parseFloat(targetGuidance);

        //May want to retain the original controlnet, but for maximum variation, probably best to leave it out. 
        //A future enhancement could make this user-selectable.
        delete newTaskRequest.reqBody.use_controlnet_model;
        delete newTaskRequest.reqBody.control_filter_to_apply;
        delete newTaskRequest.reqBody.control_image;

        delete newTaskRequest.reqBody.use_upscale; //if previously used upscaler, we don't want to automatically do it again

        delete newTaskRequest.reqBody.mask

        createTask(newTaskRequest);

        const supportBanner = document.getElementById('supportBanner');
        const panelContainer = supportBanner.nextElementSibling;
        const panel = panelContainer.firstElementChild;

        panelContainer.classList.add('similarx2');
        panel.children[6].classList.add('similarx2Panel');

        const panelOutputMsg = panel.children[7];
        panelOutputMsg.style.display = 'block';
        panelOutputMsg.textContent = `Waiting to make similar images X 2`;

        //console.log("newTaskRequest", parent, panelOutputMsg);
    }

    function onMakeSimilarx2Filter(origRequest, image) {
        return true;
    }

    const similarCopy = document.getElementById("similarCopy");
    similarCopy.addEventListener("click", function(){
        document.getElementById('similar_prompt').value = document.getElementById('prompt').value;
        document.getElementById('similar_negative_prompt').value = document.getElementById('negative_prompt').value;
        //similarPrompt = posPrompt;
        //similarNegativePrompt = negPrompt;
    })

    //////////////////////////////

    PLUGINS['IMAGE_INFO_BUTTONS'].push([
        { text: "Save to Favorites", on_click: onSaveFavorite, filter: onSaveFavoriteFilter }
    ]);

    function onSaveFavorite(origRequest, image) {
        var isTurbo = isModelTurbo(origRequest.use_stable_diffusion_model, origRequest.use_lora_model);

        const newTaskRequest = modifyCurrentRequest(origRequest, {
            num_outputs: 1,
            num_outputs_total: 1,
            // For Turbo, 22 steps is OK, but noticeable improvement at 30.   Larger resolutions show defects/duplication.
            //num_inference_steps: (isTurbo) ? 28 : Math.min(parseInt(origRequest.num_inference_steps), 60),  //large resolutions combined with large steps can cause an error
            num_inference_steps: Math.min(document.getElementById('similar_num_inference_steps').value, 60),
            num_outputs_parallel: parseInt(origRequest.num_outputs_parallel),
        })

        newTaskRequest.numOutputsTotal = 1;
        newTaskRequest.reqBody.save_to_disk_path = 'C://AI_Favorites';
        newTaskRequest.batchCount = 1;

        createTask(newTaskRequest);

        const supportBanner = document.getElementById('supportBanner');
        const panelContainer = supportBanner.nextElementSibling;
        const panel = panelContainer.firstElementChild;

        panelContainer.classList.add('favorite');
        panel.children[6].classList.add('favoritePanel');

        const panelOutputMsg = panel.children[7];
        panelOutputMsg.style.display = 'block';
        panelOutputMsg.textContent = `Waiting to save favorite`;
        console.log("Save to server", newTaskRequest, info);
    }

    function onSaveFavoriteFilter(origRequest, image) {
        return true;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // create the arrow zone
    const editorContainer = document.querySelector('#editor')
    editorContainer.insertAdjacentHTML('beforebegin', `
        <div  id="paneToggleContainer">
            <div id="paneToggle">
                <div id="editorToggleArrow" class="arrow-left"></div>
            </div>
        </div>
    `)

    // update editor style and size
    const editorToggleContainer = document.querySelector('#paneToggleContainer')
    editorContainer.classList.add('pane-toggle')
    imagePreview.classList.add('scrollbar-preview')
    updatePreviewSize()

    /* EDITOR AND PREVIEW PANE LAYOUT */
    // update preview pane size and position
    function updatePreviewSize(leftPosition) {
        if (window.innerWidth < 700) {
            return
        }

        // adjust the topnav placeholder's height
        hiddenHeader.style.height = topNavbar.offsetHeight + 'px'

        // resize the editor and preview panes as needed
        topNavbar.style.marginTop = '' // fix for the proper menubar Chrome extension that changes the margin-top
        editorContainer.style.top = (topNavbar.offsetTop + topNavbar.offsetHeight) + 'px'
        imagePreview.style.top = (topNavbar.offsetTop + topNavbar.offsetHeight) + 'px'
        imagePreview.style.left = (typeof leftPosition == 'number' ? leftPosition : (editorContainer.offsetLeft + editorContainer.offsetWidth)) + 'px'
        // reposition the toggle container and button
        editorToggleContainer.style.top = editorContainer.style.top
        editorToggleContainer.style.bottom = '0px'
    };
    window.addEventListener("resize", updatePreviewSize)

    document.addEventListener("tabClick", (e) => {
        // update the body's overflow-y depending on the selected tab
        if (e.detail.name == 'main') {
            document.body.style.overflowY = 'hidden'
        }
        else {
            document.body.style.overflowY = 'auto'
        }
    })

    function observeResize(element, callbackFunction) {
        const resizeObserver = new ResizeObserver(callbackFunction)
        resizeObserver.observe(element, { box: 'border-box' })
    }
    observeResize(editorContainer, updatePreviewSize)
    observeResize(topNavbar, updatePreviewSize)
    let loadingScrollingPane = false;

    function Autoscroll(target) {
        if (autoScroll.checked && target !== null) {
            toolbarTimerHide = setTimeout(function () {
                hideToolbar()
            }, HIDE_TOOLBAR_TIMER);
        }
    }

    // observe for changes in the preview pane
    let autoScroll = document.querySelector("#auto_scroll")
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.className == 'img-batch') {
                Autoscroll(mutation.target)
            }
        })
    })

    observer.observe(document.getElementById('preview'), {
        childList: true,
        subtree: true
    })


})()
