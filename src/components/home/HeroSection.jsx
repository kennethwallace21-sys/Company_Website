import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';

const shaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  uv.x-=.4;
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(2,3,4))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.03,bg*.08,bg*.2),d);
  }
  O=vec4(col,1);
}`;

function useShaderBackground(containerRef, setShaderFailed) {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const animFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            setShaderFailed(true);
            return;
        }

        const isMobile = window.innerWidth < 768;
        const dpr = isMobile ? 0.35 : Math.max(1, 0.5 * window.devicePixelRatio);
        
        const vertSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

        const compileShader = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
            }
            return s;
        };

        const vs = compileShader(gl.VERTEX_SHADER, vertSrc);
        const fs = compileShader(gl.FRAGMENT_SHADER, shaderSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'resolution');
        const uTime = gl.getUniformLocation(program, 'time');

        const resize = () => {
            const container = containerRef?.current || document.documentElement;
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        const loop = (now) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, now * 1e-3);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animFrameRef.current = requestAnimationFrame(loop);
        };

        resize();
        loop(0);
        window.addEventListener('resize', resize);

        rendererRef.current = { program, vs, fs };

        return () => {
            window.removeEventListener('resize', resize);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        };
    }, [containerRef, setShaderFailed]);

    return canvasRef;
}

export default function HeroSection() {
    const sectionRef = useRef(null);
    const [shaderFailed, setShaderFailed] = React.useState(false);
    const canvasRef = useShaderBackground(sectionRef, setShaderFailed);

    const benefits = [
        "Deployed in your environment",
        "Production-ready from day one",
        "Government and enterprise ready"
    ];

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-black">
            {/* Shader Background */}
            {shaderFailed ? (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#020617] via-[#0a1628] to-[#030a1a]" />
            ) : (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full touch-none"
                    style={{ background: 'black' }}
                />
            )}

            {/* Slight overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-[1]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-blue-300 text-sm font-medium">We Build AI That Runs</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
                    >
                        Unlock the Power of{' '}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-sky-400"
                        >
                            Catalyst Applied AI
                        </motion.span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
                    >
                        We build production AI systems and deploy them in your environment. RAG, agentic workflows, workforce intelligence, signal analytics, and domain-trained AI agents.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col sm:flex-row gap-4 mb-10"
                    >
                        <Button
                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 group"
                        >
                            See What We Build
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={() => window.location.href = 'mailto:sales@catalystappliedai.com?subject=Talk%20to%20Our%20Team'}
                            className="border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/15 text-blue-300 hover:text-blue-200 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all"
                        >
                            Talk to Our Team
                        </Button>
                    </motion.div>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="flex items-center gap-2 text-slate-300"
                            >
                                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                <span className="text-sm sm:text-base">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <button
                    type="button"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                >
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="w-9 h-9 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:border-blue-400/50"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </button>
            </motion.div>
        </section>
    );
}
