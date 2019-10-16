FROM gitpod/workspace-full

USER root
RUN apt-get update -y
RUN apt-get -y install links
