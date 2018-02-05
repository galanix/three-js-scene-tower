var THREEx	= THREEx || {};

THREEx.Glow	= function(renderer, camera, renderTarget){
	// setup the RenderTarget
	if( renderTarget === undefined ){
		var textureW	= Math.floor(renderer.domElement.offsetWidth/8)
		var textureH	= Math.floor(renderer.domElement.offsetHeight/8)
		renderTarget	= new THREE.WebGLRenderTarget(textureW, textureH, {
			minFilter	: THREE.LinearFilter,
			magFilter	: THREE.LinearFilter,
			format		: THREE.RGBFormat
		})		
	}
	this.renderTarget = renderTarget
	
	var scene	= new THREE.Scene
	this.scene	= scene

	console.assert( THREE.HorizontalBlurShader )
	console.assert( THREE.VerticalBlurShader )

	var blurHLevel	= 0.005;
	var blurVLevel	= 0.01;

	var composer	= new THREE.EffectComposer( renderer, renderTarget );
	this.composer	= composer

	// add Render Pass
	var effect	= new THREE.RenderPass(scene, camera);
	composer.addPass( effect )

	// add HorizontalBlur Pass
	var effect	= new THREE.ShaderPass( THREE.HorizontalBlurShader )
	effect.uniforms[ 'h' ].value	= blurHLevel 
	composer.addPass( effect )
	// add HorizontalBlur Pass
	var effect	= new THREE.ShaderPass( THREE.VerticalBlurShader )
	effect.uniforms[ 'v' ].value	= blurVLevel
	composer.addPass( effect )

	// add HorizontalBlur Pass
	var effect	= new THREE.ShaderPass( THREE.HorizontalBlurShader )
	effect.uniforms[ 'h' ].value	= blurHLevel 
	composer.addPass( effect )
	// add HorizontalBlur Pass
	var effect	= new THREE.ShaderPass( THREE.VerticalBlurShader )
	effect.uniforms[ 'v' ].value	= blurVLevel
	composer.addPass( effect )

	// mark the last pass as ```renderToScreen```
	composer.passes[composer.passes.length-1].renderToScreen	= true;
}

THREEx.Glow.prototype.update = function(delta, now) {
	this.composer.render(delta);
};

/**
 * copy the scene 
 * @param  {THREE.Scene} srcScene   the scene to copy
 * @param  {Function} materialCb callback called to determined material of THREE.Mesh's
 * @return {THREE.Scene}            the just-built scene
 */
THREEx.Glow.prototype.copyScene = function(srcScene, materialCb){
	
	return copyNode(srcScene, materialCb, this.scene)

	function copyNode(srcObject, materialCb, dstObject){
		// handle srcObject per type
		if( dstObject !== undefined ){
			// just keep it
		}else if( srcObject instanceof THREE.Scene ){
			dstObject	= new THREE.Scene()
		}else if( srcObject instanceof THREE.Mesh ){
			var geometry	= srcObject.geometry.clone()
			var material	= materialCb(srcObject)
			dstObject	= new THREE.Mesh( geometry, material )
		}else if( srcObject instanceof THREE.Object3D ){
			dstObject	= new THREE.Object3D()
		}else	console.assert(false)
		// clone position/rotation/scale
		dstObject.position	= srcObject.position
		dstObject.rotation	= srcObject.rotation
		dstObject.scale		= srcObject.scale
		// clone children
		for(var i = 0; i < srcObject.children.length; i ++ ) {
			var srcChild	= srcObject.children[ i ];
			var dstChild	= copyNode( srcChild, materialCb )
			dstObject.add( dstChild );
		}
		// return the object we just built
		return dstObject
	}
}