# modified from https://github.com/andrehaveman/spotify-node-applescript/blob/master/lib/scripts/get_track.applescript
on escape_quotes(string_to_escape)
	set AppleScript's text item delimiters to the "\""
	set the item_list to every text item of string_to_escape
	set AppleScript's text item delimiters to the "\\\""
	set string_to_escape to the item_list as string
	set AppleScript's text item delimiters to ""
	return string_to_escape
end escape_quotes

if application "Spotify" is running then
	tell application "Spotify"
		set ctrack to "{"
		set ctrack to ctrack & "\"artist\": \"" & my escape_quotes(current track's artist) & "\""
		set ctrack to ctrack & ",\"album\": \"" & my escape_quotes(current track's album) & "\""
		set ctrack to ctrack & ",\"disc_number\": " & current track's disc number
		set ctrack to ctrack & ",\"duration\": " & current track's duration
		set ctrack to ctrack & ",\"played_count\": " & current track's played count
		set ctrack to ctrack & ",\"track_number\": " & current track's track number
		set ctrack to ctrack & ",\"popularity\": " & current track's popularity
		set ctrack to ctrack & ",\"id\": \"" & current track's id & "\""
		set ctrack to ctrack & ",\"name\": \"" & my escape_quotes(current track's name) & "\""
		set ctrack to ctrack & ",\"album_artist\": \"" & my escape_quotes(current track's album artist) & "\""
		set ctrack to ctrack & ",\"artwork_url\": \"" & current track's artwork url & "\""
		set ctrack to ctrack & ",\"spotify_url\": \"" & current track's spotify url & "\""
		set ctrack to ctrack & "}"
		return ctrack
	end tell
else
	return ""
end if
