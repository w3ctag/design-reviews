/***********************************
 * 1.2: Modular Routing
 * playing a single sound
 **/
var context = new AudioContext();

function playSound() {
    var source = context.createBufferSource();
    source.buffer = dogBarkingBuffer;
    source.connect(context.destination);
    source.start(0);
}
                    

/***********************************
 * 1.2: Modular Routing
 * three sources and a convolution reverb send with a dynamics compressor at 
 * the final output stage
 **/
var context = 0;
var compressor = 0;
var reverb = 0;

var source1 = 0;
var source2 = 0;
var source3 = 0;

var lowpassFilter = 0;
var waveShaper = 0;
var panner = 0;

var dry1 = 0;
var dry2 = 0;
var dry3 = 0;

var wet1 = 0;
var wet2 = 0;
var wet3 = 0;

var masterDry = 0;
var masterWet = 0;

function setupRoutingGraph () {
    context = new AudioContext();

    // Create the effects nodes.
    lowpassFilter = context.createBiquadFilter();
    waveShaper = context.createWaveShaper();
    panner = context.createPanner();
    compressor = context.createDynamicsCompressor();
    reverb = context.createConvolver();

    // Create master wet and dry.
    masterDry = context.createGain();
    masterWet = context.createGain();

    // Connect final compressor to final destination.
    compressor.connect(context.destination);

    // Connect master dry and wet to compressor.
    masterDry.connect(compressor);
    masterWet.connect(compressor);

    // Connect reverb to master wet.
    reverb.connect(masterWet);

    // Create a few sources.
    source1 = context.createBufferSource();
    source2 = context.createBufferSource();
    source3 = context.createOscillator();

    source1.buffer = manTalkingBuffer;
    source2.buffer = footstepsBuffer;
    source3.frequency.value = 440;

    // Connect source1
    dry1 = context.createGain();
    wet1 = context.createGain();
    source1.connect(lowpassFilter);
    lowpassFilter.connect(dry1);
    lowpassFilter.connect(wet1);
    dry1.connect(masterDry);
    wet1.connect(reverb);

    // Connect source2
    dry2 = context.createGain();
    wet2 = context.createGain();
    source2.connect(waveShaper);
    waveShaper.connect(dry2);
    waveShaper.connect(wet2);
    dry2.connect(masterDry);
    wet2.connect(reverb);

    // Connect source3
    dry3 = context.createGain();
    wet3 = context.createGain();
    source3.connect(panner);
    panner.connect(dry3);
    panner.connect(wet3);
    dry3.connect(masterDry);
    wet3.connect(reverb);
    
    // Start the sources now.
    source1.start(0);
    source2.start(0);
    source3.start(0);
}
 

/***********************************
 * 4.5.4 AudioParam Automation Example
 **/
var t0 = 0;
var t1 = 0.1;
var t2 = 0.2;
var t3 = 0.3;
var t4 = 0.4;
var t5 = 0.6;
var t6 = 0.7;
var t7 = 1.0;

var curveLength = 44100;
var curve = new Float32Array(curveLength);
for (var i = 0; i < curveLength; ++i)
    curve[i] = Math.sin(Math.PI * i / curveLength);

param.setValueAtTime(0.2, t0);
param.setValueAtTime(0.3, t1);
param.setValueAtTime(0.4, t2);
param.linearRampToValueAtTime(1, t3);
param.linearRampToValueAtTime(0.15, t4);
param.exponentialRampToValueAtTime(0.75, t5);
param.exponentialRampToValueAtTime(0.05, t6);
param.setValueCurveAtTime(curve, t6, t7 - t6);


/***********************************
  * 4.11 The MediaElementAudioSourceNode Interface
  **/ 
var mediaElement = document.getElementById('mediaElementID');
var sourceNode = context.createMediaElementSource(mediaElement);
sourceNode.connect(filterNode);

 
/***********************************
 * 4.16.1 Attributes
 **/
float calculateNormalizationScale(buffer)
{
    const float GainCalibration = 0.00125;
    const float GainCalibrationSampleRate = 44100;
    const float MinPower = 0.000125;
  
    // Normalize by RMS power.
    size_t numberOfChannels = buffer->numberOfChannels();
    size_t length = buffer->length();

    float power = 0;

    for (size_t i = 0; i < numberOfChannels; ++i) {
        float* sourceP = buffer->channel(i)->data();
        float channelPower = 0;

        int n = length;
        while (n--) {
            float sample = *sourceP++;
            channelPower += sample * sample;
        }

        power += channelPower;
    }

    power = sqrt(power / (numberOfChannels * length));

    // Protect against accidental overload.
    if (isinf(power) || isnan(power) || power < MinPower)
        power = MinPower;

    float scale = 1 / power;

    // Calibrate to make perceived volume same as unprocessed.
    scale *= GainCalibration;

    // Scale depends on sample-rate.
    if (buffer->sampleRate())
        scale *= GainCalibrationSampleRate / buffer->sampleRate();

    // True-stereo compensation.
    if (buffer->numberOfChannels() == 4)
        scale *= 0.5;

    return scale;
}
          

/***********************************
 * 6. Mixer Gain Structure
 * Example: Mixer with Send Busses
 **/
var context = 0;
var compressor = 0;
var reverb = 0;
var delay = 0;
var s1 = 0;
var s2 = 0;

var source1 = 0;
var source2 = 0;
var g1_1 = 0;
var g2_1 = 0;
var g3_1 = 0;
var g1_2 = 0;
var g2_2 = 0;
var g3_2 = 0;

// Setup routing graph 
function setupRoutingGraph() {
    context = new AudioContext();

    compressor = context.createDynamicsCompressor();

    // Send1 effect 
    reverb = context.createConvolver();
    // Convolver impulse response may be set here or later 

    // Send2 effect 
    delay = context.createDelay();

    // Connect final compressor to final destination 
    compressor.connect(context.destination);

    // Connect sends 1 & 2 through effects to main mixer 
    s1 = context.createGain();
    reverb.connect(s1);
    s1.connect(compressor);
    
    s2 = context.createGain();
    delay.connect(s2);
    s2.connect(compressor);

    // Create a couple of sources 
    source1 = context.createBufferSource();
    source2 = context.createBufferSource();
    source1.buffer = manTalkingBuffer;
    source2.buffer = footstepsBuffer;

    // Connect source1 
    g1_1 = context.createGain();
    g2_1 = context.createGain();
    g3_1 = context.createGain();
    source1.connect(g1_1);
    source1.connect(g2_1);
    source1.connect(g3_1);
    g1_1.connect(compressor);
    g2_1.connect(reverb);
    g3_1.connect(delay);

    // Connect source2 
    g1_2 = context.createGain();
    g2_2 = context.createGain();
    g3_2 = context.createGain();
    source2.connect(g1_2);
    source2.connect(g2_2);
    source2.connect(g3_2);
    g1_2.connect(compressor);
    g2_2.connect(reverb);
    g3_2.connect(delay);

    // We now have explicit control over all the volumes g1_1, g2_1, ..., s1, s2 
    g2_1.gain.value = 0.2;  // For example, set source1 reverb gain 

     // Because g2_1.gain is an "AudioParam", 
     // an automation curve could also be attached to it. 
     // A "mixing board" UI could be created in canvas or WebGL controlling these gains. 
}


/***********************************
  * 7. Dynamic Lifetime
  **/ 

var context = 0;
var compressor = 0;
var gainNode1 = 0;
var streamingAudioSource = 0;

// Initial setup of the "long-lived" part of the routing graph  
function setupAudioContext() {
    context = new AudioContext();

    compressor = context.createDynamicsCompressor();
    gainNode1 = context.createGain();

    // Create a streaming audio source.
    var audioElement = document.getElementById('audioTagID');
    streamingAudioSource = context.createMediaElementSource(audioElement);
    streamingAudioSource.connect(gainNode1);

    gainNode1.connect(compressor);
    compressor.connect(context.destination);
}

// Later in response to some user action (typically mouse or key event) 
// a one-shot sound can be played. 
function playSound() {
    var oneShotSound = context.createBufferSource();
    oneShotSound.buffer = dogBarkingBuffer;

    // Create a filter, panner, and gain node. 
    var lowpass = context.createBiquadFilter();
    var panner = context.createPanner();
    var gainNode2 = context.createGain();

    // Make connections 
    oneShotSound.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(gainNode2);
    gainNode2.connect(compressor);

    // Play 0.75 seconds from now (to play immediately pass in 0)
    oneShotSound.start(context.currentTime + 0.75);
}


/***********************************
 * 11. Spatialization / Panning
 **/
// Calculate the source-listener vector.
vec3 sourceListener = source.position - listener.position;

if (sourceListener.isZero()) {
    // Handle degenerate case if source and listener are at the same point.
    azimuth = 0;
    elevation = 0;
    return;
}

sourceListener.normalize();

// Align axes.
vec3 listenerFront = listener.orientation;
vec3 listenerUp = listener.up;
vec3 listenerRight = listenerFront.cross(listenerUp);
listenerRight.normalize();

vec3 listenerFrontNorm = listenerFront;
listenerFrontNorm.normalize();

vec3 up = listenerRight.cross(listenerFrontNorm);

float upProjection = sourceListener.dot(up);

vec3 projectedSource = sourceListener - upProjection * up;
projectedSource.normalize();

azimuth = 180 * acos(projectedSource.dot(listenerRight)) / PI;

// Source in front or behind the listener.
double frontBack = projectedSource.dot(listenerFrontNorm);
if (frontBack < 0)
    azimuth = 360 - azimuth;

// Make azimuth relative to "front" and not "right" listener vector.
if ((azimuth >= 0) && (azimuth <= 270))
    azimuth = 90 - azimuth;
else
    azimuth = 450 - azimuth;

elevation = 90 - 180 * acos(sourceListener.dot(up)) / PI;

if (elevation > 90)
    elevation = 180 - elevation;
else if (elevation < -90)
    elevation = -180 - elevation;


/***********************************
 * 9. Channel up-mixing and down-mixing
 * 9.2 Channel Rules Examples
 **/
 
// Set gain node to explicit 2-channels (stereo).
gain.channelCount = 2;
gain.channelCountMode = "explicit";
gain.channelInterpretation = "speakers";

// Set "hardware output" to 4-channels for DJ-app with two stereo output busses.
context.destination.channelCount = 4;
context.destination.channelCountMode = "explicit";
context.destination.channelInterpretation = "discrete";

// Set "hardware output" to 8-channels for custom multi-channel speaker array
// with custom matrix mixing.
context.destination.channelCount = 8;
context.destination.channelCountMode = "explicit";
context.destination.channelInterpretation = "discrete";

// Set "hardware output" to 5.1 to play an HTMLAudioElement.
context.destination.channelCount = 6;
context.destination.channelCountMode = "explicit";
context.destination.channelInterpretation = "speakers";

// Explicitly down-mix to mono.
gain.channelCount = 1;
gain.channelCountMode = "explicit";
gain.channelInterpretation = "speakers";
 

/***********************************
 * 11. Sound Cones
 **/
if (source.orientation.isZero() || ((source.coneInnerAngle == 360) && (source.coneOuterAngle == 360)))
    return 1; // no cone specified - unity gain

// Normalized source-listener vector
vec3 sourceToListener = listener.position - source.position;
sourceToListener.normalize();

vec3 normalizedSourceOrientation = source.orientation;
normalizedSourceOrientation.normalize();

// Angle between the source orientation vector and the source-listener vector
double dotProduct = sourceToListener.dot(normalizedSourceOrientation);
double angle = 180 * acos(dotProduct) / PI;
double absAngle = fabs(angle);

// Divide by 2 here since API is entire angle (not half-angle)
double absInnerAngle = fabs(source.coneInnerAngle) / 2;
double absOuterAngle = fabs(source.coneOuterAngle) / 2;
double gain = 1;

if (absAngle <= absInnerAngle)
    // No attenuation
    gain = 1;
else if (absAngle >= absOuterAngle)
    // Max attenuation
    gain = source.coneOuterGain;
else {
    // Between inner and outer cones
    // inner -> outer, x goes from 0 -> 1
    double x = (absAngle - absInnerAngle) / (absOuterAngle - absInnerAngle);
    gain = (1 - x) + source.coneOuterGain * x;
}

return gain;


/***********************************
 * 11. Doppler Shift
 **/
double dopplerShift = 1; // Initialize to default value
double dopplerFactor = listener.dopplerFactor;

if (dopplerFactor > 0) {
    double speedOfSound = listener.speedOfSound;

    // Don't bother if both source and listener have no velocity.
    if (!source.velocity.isZero() || !listener.velocity.isZero()) {
        // Calculate the source to listener vector.
        vec3 sourceToListener = source.position - listener.position;

        double sourceListenerMagnitude = sourceToListener.length();

        double listenerProjection = sourceToListener.dot(listener.velocity) / sourceListenerMagnitude;
        double sourceProjection = sourceToListener.dot(source.velocity) / sourceListenerMagnitude;

        listenerProjection = -listenerProjection;
        sourceProjection = -sourceProjection;

        double scaledSpeedOfSound = speedOfSound / dopplerFactor;
        listenerProjection = min(listenerProjection, scaledSpeedOfSound);
        sourceProjection = min(sourceProjection, scaledSpeedOfSound);

        dopplerShift = ((speedOfSound - dopplerFactor * listenerProjection) / (speedOfSound - dopplerFactor * sourceProjection));
        fixNANs(dopplerShift); // Avoid illegal values

        // Limit the pitch shifting to 4 octaves up and 3 octaves down.
        dopplerShift = min(dopplerShift, 16);
        dopplerShift = max(dopplerShift, 0.125);
    }
}

