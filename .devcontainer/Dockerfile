FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y sudo wget software-properties-common

RUN add-apt-repository ppa:git-core/ppa && apt update && apt install -y git zsh

ARG USERNAME=ubuntu
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

ENV NVM_DIR=/usr/local/nvm
RUN mkdir -p ${NVM_DIR}
SHELL ["/bin/bash", "--login", "-c"]
RUN wget -O- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
RUN bash -c 'source ${NVM_DIR}/nvm.sh && nvm install --lts'
RUN apt clean
RUN chsh ${USERNAME} -s /usr/bin/zsh

USER $USERNAME
RUN sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
RUN echo "export NVM_DIR=${NVM_DIR}"                                         >> "$HOME/.bashrc"
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"
RUN echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"' >> "$HOME/.bashrc"
RUN echo "export NVM_DIR=${NVM_DIR}"                                         >> "$HOME/.zshrc"
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.zshrc"

