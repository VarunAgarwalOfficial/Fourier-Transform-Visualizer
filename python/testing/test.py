from random import sample
import matplotlib.pyplot as plt
import numpy as np
from math import *
from points import series


dft = []
dft2 = np.fft.fft(series)



for k in range(len(series)):
    sum = 0
    for n in range(len(series)):
        sum += series[n] * np.exp(-1j * 2 * np.pi * k * n / len(series))
    dft.append(sum)


plt.plot(np.linspace(0, len(dft), len(dft)), dft)
plt.plot(np.linspace(0, len(dft), len(dft)), dft2)

re = []
re2 = np.fft.ifft(dft)

for n in range(len(series)):
    sum = 0
    for k in range(len(dft) ):
        sum += (np.abs(dft)[k]) * np.cos(2*np.pi*k*n / len(dft) + np.angle(dft[k]))  + 1j*(np.abs(dft)[k]) * np.sin(2*np.pi*k*n / len(dft) + np.angle(dft[k]))
    re.append(sum / len(dft))

# re = np.fft.ifft(dft)





plt.figure()




plt.plot(np.linspace(0 , len(dft),len(dft)) ,np.real(re))
plt.figure()
plt.plot(np.linspace(0 , len(dft),len(dft)) , np.real(re2))
plt.figure()
plt.plot(np.linspace(0 , len(dft),len(dft)) , np.real(series))

plt.show()





