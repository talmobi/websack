const test = require( 'tape' )

const execSync = require( 'child_process' ).execSync

const fs = require( 'fs' )
const path = require( 'path' )

const binPath = path.join( __dirname, '../bin/cli.js' )

test( 'noargs', function ( t ) {
	t.plan( 1 )
	const opts = {}
	const buffer = execSync( binPath, opts )
	t.deepEqual(
		buffer,
		fs.readFileSync( path.join( __dirname, 'stage/noargs-output.txt' ) )
	)
} )

test( 'download', function ( t ) {
	t.plan( 1 )
	const opts = {}
	const buffer = execSync( binPath + ' download', opts )
	t.deepEqual(
		buffer,
		fs.readFileSync( path.join( __dirname, 'stage/download-cmd-output.txt' ) )
	)
} )

test( 'bundle', function ( t ) {
	t.plan( 1 )
	const opts = {}
	const buffer = execSync( binPath + ' bundle', opts )
	t.deepEqual(
		buffer,
		fs.readFileSync( path.join( __dirname, 'stage/bundle-cmd-output.txt' ) )
	)
} )

test( 'install', function ( t ) {
	t.plan( 1 )
	const opts = {}
	const buffer = execSync( binPath + ' install', opts )
	t.deepEqual(
		buffer,
		fs.readFileSync( path.join( __dirname, 'stage/install-cmd-output.txt' ) )
	)
} )
