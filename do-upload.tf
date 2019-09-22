provider "digitalocean" {
    token = "${var.do_token}"
}

resource "digitalocean_droplet" "docker" {
    image = "docker-18-04"
    name = "docker"
    region = "nyc3"
    size = "2gb"
    ssh_keys = ["${var.ssh_fingerprint}"]
    connection {
        user = "root"
        host = "${self.ipv4_address}"
        agent = true
        private_key = "${file(var.pvt_key)}"
        timeout = "3m"
    }
    provisioner "file" {
      source      = "./api"
      destination = "/source/app"
    }
    provisioner "file" {
      source      = "./Dockerfile"
      destination = "/source"
    }
    provisioner "file" {
      source      = "./docker-compose.yml"
      destination = "/source"
    }
    provisioner "remote-exec" {
        inline = [
        "cd source",
        "docker-compose up --build",
        ]
    }
}
