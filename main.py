from pydub import AudioSegment
from pydub.generators import Sine

# Parameters for the beep sound
duration = 1000  # Duration of the beep in milliseconds
frequency = 250  # Frequency of the beep in Hz

# Generate a beep sound
beep = Sine(frequency).to_audio_segment(duration=duration)

# Define the output file path
output_file_path = "beep_250_.wav"

# Export the beep sound to an audio file
beep.export(output_file_path, format="wav")

print(f"Beep sound saved as {output_file_path}")
