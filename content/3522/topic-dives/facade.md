---
id: facade-dive
title: "Facade pattern — deep dive"
pillar: tech
priority: low
tags: [pattern, structural, facade]
source: "DesignPatternsTable p.6, Week 11 Slides, Dec 2024 Final Q11"
bloom_levels: [understand, apply]
related: [mediator, proxy]
---

## When to use

A subsystem has many classes with intricate usage rules. You want clients to interact with it via a simple API, without learning the internals.

## Worked example

```python
class CodecFactory:
    @staticmethod
    def extract(file):
        return MPEG4Codec() if file.endswith(".mp4") else OggCodec()

class BitrateReader:
    @staticmethod
    def read(file, codec): return f"buffer from {file} via {codec}"
    @staticmethod
    def convert(buffer, codec): return f"converted {buffer} to {codec}"

class AudioMixer:
    def fix(self, data): return f"{data} + audio-fixed"

class VideoConverter:   # the Facade
    def convert(self, filename, format):
        src = CodecFactory.extract(filename)
        dst = MPEG4Codec() if format == "mp4" else OggCodec()
        buf = BitrateReader.read(filename, src)
        result = BitrateReader.convert(buf, dst)
        return AudioMixer().fix(result)

VideoConverter().convert("clip.mp4", "ogg")
```

The client only imports `VideoConverter`. The subsystem classes stay private to the module.

## Facade vs Mediator

| | Facade | Mediator |
|---|---|---|
| Role | Simplified entry into a subsystem | Coordinator of peer components |
| Subsystem awareness | Components don't know the facade | Components actively call the mediator |
| Direction | Client → subsystem (one-way) | Components ↔ mediator (two-way) |
| Adds behavior? | No — just a friendly API | No new subsystem behavior; coordinates existing |

## Past-exam pattern-match

> **Example**
> *Dec 2024 Final Q11:* "Facade does not introduce new functionality to a subsystem, while Mediator coordinates component interactions" — correct (Option C). Distractors reverse the direction or claim Facade increases coupling.

## Takeaway

> **Takeaway**
> Facade is a friendlier doorway into a complex subsystem. It hides complexity, not capability. If your client needs advanced subsystem features, they can still reach past the facade — unlike Proxy, Facade does not gatekeep.
