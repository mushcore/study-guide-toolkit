---
n: 14
id: facade
title: "Facade — one simple door to a complex subsystem"
hook: "A video converter that internally calls AudioMixer, VideoFile, BitrateReader, CodecFactory, MPEG4CompressionCodec… Your client wants to call `convert(file, format)` and nothing else."
tags: [pattern, structural, facade]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.6, Week 11 Slides"
bloom_levels: [understand, apply]
related: [mediator, proxy]
---

Your app uses a library with twenty classes. The right sequence of calls is buried in tutorials. You write a Facade: one class with a few methods that encapsulates the whole workflow. Clients call the facade; the facade orchestrates the library.

```python
class VideoConverter:
    def convert(self, filename, target_format):
        file = VideoFile(filename)
        src_codec = CodecFactory.extract(file)
        dst_codec = MPEG4Codec() if target_format == "mp4" else OggCodec()
        buffer = BitrateReader.read(filename, src_codec)
        result = BitrateReader.convert(buffer, dst_codec)
        return AudioMixer().fix(result)

# Client
output = VideoConverter().convert("clip.mp4", "ogg")
```

Clients don't import `CodecFactory`, `BitrateReader`, `AudioMixer`. They depend on `VideoConverter` only. The subsystem is free to change internally — as long as the Facade's public API stays stable.

> **Q:** What's the difference between a Facade and a utility function that wraps the same call sequence?
> **A:** Functionally similar for one use case. Facade is a proper class with (often) many methods that comprehensively represent the simplified subsystem interface. A utility function wraps one workflow. Facade is the structured pattern for hiding a whole subsystem; a utility is an ad-hoc fix for one chain.

## Facade vs Mediator

| | Direction | Subsystem awareness |
|---|---|---|
| **Facade** | Client → subsystem (one-way) | Subsystem doesn't know the facade exists |
| **Mediator** | Components ↔ mediator (two-way) | Components actively call the mediator |

Past-exam MCQ hint: "Facade does not introduce new functionality to a subsystem, while Mediator coordinates component interactions" — TRUE. *Dec 2024 Final Q11.*

## Takeaway

> **Takeaway**
> Facade hides complexity behind a simplified API. It adds no new behavior — just a friendlier entry point. Use when a subsystem is painful for clients to consume directly.
