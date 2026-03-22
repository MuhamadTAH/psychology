
function Copy-Thumbnail {
    param(
        [string]$SourceDir,
        [string]$DestName
    )
    if (Test-Path $SourceDir) {
        $images = Get-ChildItem "$SourceDir\*.jpg"
        if ($images) {
            # Sort by number in filename. Try to parse int, fallback to string if fails (though pattern is 1,2,3...)
            $lastImage = $images | Sort-Object { 
                try { [int]$_.BaseName } catch { $_.BaseName } 
            } | Select-Object -Last 1
            
            if ($lastImage) {
                Copy-Item $lastImage.FullName "public\VIdeo\$DestName.jpg"
            }
        }
    }
}

# That Never Happened
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\That never happened\THE SPAR" "degree1_that_never_happened_spar_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\That never happened\COUNTER" "degree1_that_never_happened_counter_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\That never happened\DECOUNSTRUCT" "degree1_that_never_happened_deconstruct_thumb"

# FOG
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Guilt, Fear, and Obligation (FOG)\SPOT IT" "degree1_fog_spot_it_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Guilt, Fear, and Obligation (FOG)\COUNTER" "degree1_fog_counter_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Guilt, Fear, and Obligation (FOG)\DECONSTRUCT" "degree1_fog_deconstruct_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Guilt, Fear, and Obligation (FOG)\THE SPAR" "degree1_fog_spar_thumb"

# Microaggressions
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Spotting MicroAggressions and Jokes that hurt\SPOT IT" "degree1_micro_spot_it_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Spotting MicroAggressions and Jokes that hurt\DECONSTRUCT" "degree1_micro_deconstruct_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Spotting MicroAggressions and Jokes that hurt\COUNTER" "degree1_micro_counter_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Spotting MicroAggressions and Jokes that hurt\THE SPAR" "degree1_micro_spar_thumb"

# Stop Being Nice
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR" "degree1_stop_nice_spar_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\COUNTER" "degree1_stop_nice_counter_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\SPOT IT" "degree1_stop_nice_spot_it_thumb"
Copy-Thumbnail "D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\DECOUNSTRUCT" "degree1_stop_nice_deconstruct_thumb"
