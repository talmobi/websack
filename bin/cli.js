#!/usr/bin/env node

const fs = require( 'graceful-fs' )
const path = require( 'path' )
const main = require( path.join( __dirname, '../src/main.js' ) )

const argv = require( 'minimist' )( process.argv.slice( 2 ) )

const cmd = argv._[ 0 ]

const helpText = fs.readFileSync( path.join( __dirname, '../help.txt' ), 'utf8' )

switch ( cmd ) {
	case 'help':
		console.log( helpText )
		break

	case 'download':
		main.download()
		break

	case 'bundle':
		main.bundle()
		break

	case 'install':
		main.install()
		break

	default:
		console.log( 'unrecognized command' )
		console.log( helpText )
}
