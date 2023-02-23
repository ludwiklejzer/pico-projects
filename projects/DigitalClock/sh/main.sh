#!/bin/sh

term_rows=$(tput lines)
term_cols=$(tput cols)

trap 'cleanup' INT
cleanup() {
	clear
	tput cnorm
	exit
}

# calculate the sleep time to the next second accurately
_sleep() {
	# get the next nanoseconds
	next=$(date +%s.%N | awk '{print int($1+1)}')
	# get the current nanoseconds
	now=$(date +%s.%N)
	sleep "$(echo "$next-$now" | bc)"
}

center_text() {
	text=$1
	columns="$(tput cols)"
	rows="$(tput lines)"
	text_lines=$(echo "$text" | wc -l)
	y_position=$(((rows - text_lines) / 2))
	tput cup "$y_position"

	echo "$1" | while IFS= read -r line; do
		printf "%*s\n" $(((${#line} + columns) / 2)) "$line"
	done
}

_clear() {
	# smootlhy fake clear
	tput cuu "$(tput lines)"
	currently_term_rows=$(tput lines)
	currently_term_cols=$(tput cols)

	# real clear when the terminal is resized
	if [ "$currently_term_rows" -ne "$term_rows" ] ||
		[ "$currently_term_cols" -ne "$term_cols" ]; then
		clear
		term_rows=$currently_term_rows
		term_cols=$currently_term_cols
	fi
}

get_hour() {
	clear

	# hide cursor
	tput civis
	if command -v toilet >/dev/null; then
		while true; do
			time=$(date "$1" | toilet --font ascii9)
			_clear
			center_text "$time"
			_sleep 1
		done
	else
		while true; do
			time=$(date "$1")
			_clear
			center_text "$time"
			_sleep 1
		done
	fi
}

if [ "$1" = "-t" ]; then
	hour_type=${2:-"24"}

	case "$hour_type" in
	"12")
		if [ "$(date +%H)" -ge 12 ]; then
			get_hour "+%r pm"
		else
			get_hour "+%ram"
		fi
		;;
	"24")
		get_hour "+%H:%M:%S"
		;;
	*)
		echo "Invalid Option!"
		;;
	esac
else
	get_hour "+%H:%M:%S"
fi
