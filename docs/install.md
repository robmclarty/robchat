## Argon2

Installation of argon2 on OSX requires jumping through a few hoops. The
following is pulled directly from
[argon2's README](https://github.com/ranisalt/node-argon2).

You **MUST** have a **node-gyp** global install before proceeding with install,
along  with GCC >= 4.8 / Clang >= 3.3. On Windows, you must compile under Visual
Studio 2015 or newer.

**node-argon2** works only and is tested against Node >=4.0.0.

**OSX**

To install GCC >= 4.8 on OSX, use [homebrew](http://brew.sh/):

```
$ brew install gcc
```

Once you've got GCC installed and ready to run, you then need to install
node-gyp, you must do this globally:

```
$ npm install -g node-gyp
```

Finally, once node-gyp is installed and ready to go, you can install this
library, specifying the GCC or Clang binary to use:

```
$ CXX=g++-5 npm install argon2
```

**NOTE**: If your GCC or Clang binary is named something different than `g++-6`,
you'll need to specify that in the command.
