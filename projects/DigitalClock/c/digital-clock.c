#include <ncurses.h>
#include <string.h>
#include <time.h>

char *get_hour(int argc, char *argv[]) {
	time_t now = time(NULL);
	struct tm *local = localtime(&now);

	int hours = local->tm_hour;
	int minutes = local->tm_min;
	int seconds = local->tm_sec;
	static char time[17];
	char ampm[3];

	sprintf(time, "%02d:%02d:%02d", hours, minutes, seconds);

	if (argc > 1 && strcmp(argv[1], "-t") == 0) {
		if (hours >= 12) {
			strcpy(ampm, "pm");
		} else {
			strcpy(ampm, "am");
		}

		if (strcmp(argv[2], "12") == 0) {
			hours = hours % 12;
			sprintf(time, "%02d:%02d:%02d %s", hours, minutes, seconds, ampm);
		}
	}

	return time;
}

int main(int argc, char *argv[]) {
	initscr();	  // start ncurses
	curs_set(0);  // remove cursor

	// text and background color
	start_color();
	init_pair(1, COLOR_WHITE, COLOR_BLACK);
	attron(COLOR_PAIR(1));

	while (1) {
		char *time = get_hour(argc, argv);
		mvprintw(LINES / 2, (COLS - 8) / 2, "%s", time);
		refresh();
		napms(1000);
	}

	return 0;
}
