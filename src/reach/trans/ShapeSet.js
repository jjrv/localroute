/*
	OSM Squeezer

	Copyright (c) "2013, by Aalto University, Finland;
	             Contributors: Juha Järvi <juha.jarvi@aalto.fi>;
	             Affiliation: Helsinki Institute for Information Technology HIIT;
	             Project: CultAR;
	             Task manager: Antti Nurminen <andy@iki.fi>;
	             URL: http://www.hiit.fi
	                  http://www.cultar.eu

	             The research leading to these results has received funding from the European Union
	             Seventh Framework Programme (FP7/2007-2013) under grant agreement no 601139"

	All rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:

	1. Redistributions of source code must retain the above copyright notice, this
	   list of conditions and the following disclaimer.
	2. Redistributions in binary form must reproduce the above copyright notice,
	   this list of conditions and the following disclaimer in the documentation
	   and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

goog.provide('reach.trans.ShapeSet');
goog.require('reach.trans.Shape');

/** @constructor */
reach.trans.ShapeSet=function() {
	/** @type {Array.<reach.trans.Shape>} */
	this.list=[];
	/** @type {number} */
	this.count=0;
};

/** @return {reach.trans.Shape} */
reach.trans.ShapeSet.prototype.createShape=function() {
	var shape;

	shape=new reach.trans.Shape();
	this.list[this.count++]=shape;

	return(shape);
};

/** @param {gis.io.PackStream} stream
  * @param {number} detail */
reach.trans.ShapeSet.prototype.exportPack=function(stream,detail) {
	var roundOff;
	var shapeList;
	var shapeNum,shapeCount,dropCount;
	var shape;

	roundOff=((1<<detail)-1)>>1;

	dropCount=0;
	shapeList=this.list;
	shapeCount=shapeList.length;

	for(shapeNum=0;shapeNum<shapeCount;shapeNum++) {
		shape=shapeList[shapeNum];
		if(shape.seqList.length==0) dropCount++;
	}

	stream.writeLong([detail,shapeCount-dropCount]);

	for(shapeNum=0;shapeNum<shapeCount;shapeNum++) {
		shape=shapeList[shapeNum];
		if(shape.seqList.length==0) continue;

		shape.exportPack(stream,detail,roundOff);
	}
};

/** @param {gis.io.PackStream} stream
  * @param {reach.trans.SeqSet} seqSet */
reach.trans.ShapeSet.prototype.importPack=function(stream,seqSet) {
	var detail;
	var roundOff;
	var shapeNum,shapeCount;
	var shape;
	var dec;

	dec=/** @type {Array.<number>} */ ([]);

	stream.readLong(dec,2);
	detail=dec[0];
	roundOff=((1<<detail)-1)>>1;

	shapeCount=dec[1];
	this.list=[];

	for(shapeNum=0;shapeNum<shapeCount;shapeNum++) {
		shape=this.createShape();
		shape.importPack(stream,detail,roundOff,seqSet);
	}
};
